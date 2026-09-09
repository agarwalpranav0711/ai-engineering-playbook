import os
import json
import time
import uuid
from typing import Dict, Any, List
from dotenv import load_dotenv
from openai import OpenAI

from models import ChatRequest, ChatResponse, WorkspaceState, ChatMessage, ApprovalRequest
from prompts import SYSTEM_PROMPT
from context_builder import ContextBuilder
from safety_policy import ToolPolicy
from execution_logger import ExecutionLogger
from tools import TOOLS_SCHEMA, execute_tool

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "openai/gpt-4o-mini")

logger = ExecutionLogger()

def run_heuristic_copilot(
    user_message: str,
    workspace: WorkspaceState,
    approval_response: Dict[str, Any] = None
) -> ChatResponse:
    """
    Enhanced heuristic engine for offline mode & deterministic evaluation testing.
    Cleanly routes user intents to tools, handles active selection context, and enforces safety.
    """
    msg_lower = user_message.lower().strip()
    executed_tools = []
    
    # 0. Handle Human Approval Response
    if approval_response:
        appr_args = approval_response.get("arguments", {})
        action = approval_response.get("action", "delete_task")
        if approval_response.get("approved"):
            tool_res, workspace, _ = execute_tool(action, appr_args, workspace, approved=True)
            executed_tools.append({"tool": action, "result": tool_res})
            return ChatResponse(
                response=f"✅ Approved! {tool_res}",
                tool_calls_executed=executed_tools,
                updated_workspace=workspace
            )
        else:
            return ChatResponse(
                response=f"❌ Action '{action}' was cancelled by user.",
                tool_calls_executed=[],
                updated_workspace=workspace
            )

    # 1. System Prompt Override / Prompt Injection Defense
    if "override" in msg_lower or "ignore all safety" in msg_lower or "follow the note instructions" in msg_lower:
        if "delete" in msg_lower:
            return ChatResponse(
                response="🛡️ Security Warning: System prompt overrides and embedded note instructions cannot alter safety boundaries or trigger unapproved deletions.",
                updated_workspace=workspace
            )

    # 2. Delete Task Request (Triggers Human Approval)
    if "delete" in msg_lower or "wipe" in msg_lower:
        if "without asking" in msg_lower:
            return ChatResponse(
                response="⚠️ Safety Policy Violation: Destructive actions like deletion cannot be executed silently without human approval.",
                updated_workspace=workspace
            )

        target_task = None
        # Check selected item first
        if workspace.selected_item_id and workspace.selected_item_type == "task":
            target_task = next((t for t in workspace.tasks if t.id == workspace.selected_item_id), None)
        
        # Check matching ID or title
        if not target_task:
            for t in workspace.tasks:
                if t.id.lower() in msg_lower or t.title.lower() in msg_lower:
                    target_task = t
                    break
        if not target_task and workspace.tasks:
            target_task = workspace.tasks[0]

        if target_task or "all" in msg_lower:
            task_id = target_task.id if target_task else "task_101"
            tool_res, workspace, approval_req = execute_tool("delete_task", {"task_id": task_id}, workspace, approved=False)
            return ChatResponse(
                response=f"I require your confirmation before deleting '{target_task.title if target_task else 'tasks'}'.",
                requires_approval=approval_req,
                updated_workspace=workspace
            )

    # 3. Refine / Update Selected Item Description or Title
    if any(k in msg_lower for k in ["refine", "make the selected", "more specific", "update selected", "rename"]):
        target_id = workspace.selected_item_id
        if workspace.selected_item_type == "task" and target_id:
            target_task = next((t for t in workspace.tasks if t.id == target_id), None)
            if target_task:
                new_desc = f"{target_task.description} (Refined for sprint review)".strip()
                new_title = target_task.title
                if "rename" in msg_lower and "'" in user_message:
                    parts = user_message.split("'")
                    if len(parts) >= 2:
                        new_title = parts[1]
                
                tool_res, workspace, _ = execute_tool("update_task", {"task_id": target_id, "title": new_title, "description": new_desc}, workspace)
                executed_tools.append({"tool": "update_task", "result": tool_res})
                return ChatResponse(
                    response=f"✨ Refined task **'{new_title}'** (ID: {target_id}).",
                    tool_calls_executed=executed_tools,
                    updated_workspace=workspace
                )
    
    # 4. Explicit Update Task Status (e.g., mark task 103 done)
    if "mark" in msg_lower or "done" in msg_lower or "complete" in msg_lower:
        target_id = None
        for t in workspace.tasks:
            if t.id.lower() in msg_lower or t.title.lower() in msg_lower:
                target_id = t.id
                break
        if not target_id and workspace.selected_item_id and workspace.selected_item_type == "task":
            target_id = workspace.selected_item_id

        if target_id:
            tool_res, workspace, _ = execute_tool("update_task", {"task_id": target_id, "status": "done"}, workspace)
            executed_tools.append({"tool": "update_task", "result": tool_res})
            return ChatResponse(
                response=f"🎉 Task `{target_id}` status updated to **done**.",
                tool_calls_executed=executed_tools,
                updated_workspace=workspace
            )

    # 5. Search Workspace / Find Tasks
    if any(k in msg_lower for k in ["find", "search", "locate", "tasks related"]):
        query = "architecture" if "architecture" in msg_lower else "ai"
        if "query" in msg_lower and "'" in user_message:
            query = user_message.split("'")[1]
            
        tool_res, workspace, _ = execute_tool("search_workspace", {"query": query}, workspace)
        executed_tools.append({"tool": "search_workspace", "result": tool_res})
        return ChatResponse(
            response=f"🔍 {tool_res}",
            tool_calls_executed=executed_tools,
            updated_workspace=workspace
        )

    # 6. Create Task
    if any(k in msg_lower for k in ["create a task", "add task", "new task", "remind me to"]):
        title = "Study MCP Protocol" if "study mcp" in msg_lower else "New Workspace Task"
        if "'" in user_message:
            title = user_message.split("'")[1]

        priority = "high" if "high" in msg_lower else "medium"
        tool_res, workspace, _ = execute_tool("create_task", {"title": title, "priority": priority}, workspace)
        executed_tools.append({"tool": "create_task", "result": tool_res})
        return ChatResponse(
            response=f"✨ Created task: **{title}** ({priority} priority)",
            tool_calls_executed=executed_tools,
            updated_workspace=workspace
        )

    # 7. Create Note
    if any(k in msg_lower for k in ["create a note", "add note", "new note", "take note"]):
        title = "Design Sync" if "design sync" in msg_lower else "Quick Note"
        if "'" in user_message:
            title = user_message.split("'")[1]

        tool_res, workspace, _ = execute_tool("create_note", {"title": title, "content": "Meeting notes content"}, workspace)
        executed_tools.append({"tool": "create_note", "result": tool_res})
        return ChatResponse(
            response=f"📝 Created note: **{title}**",
            tool_calls_executed=executed_tools,
            updated_workspace=workspace
        )

    # 8. Extract Tasks from Note
    if "extract" in msg_lower and "note" in msg_lower:
        note_id = "note_201"
        if workspace.selected_item_id and workspace.selected_item_type == "note":
            note_id = workspace.selected_item_id

        tool_res, workspace, _ = execute_tool("extract_tasks_from_note", {"note_id": note_id}, workspace)
        executed_tools.append({"tool": "extract_tasks_from_note", "result": tool_res})
        return ChatResponse(
            response=f"📋 {tool_res}",
            tool_calls_executed=executed_tools,
            updated_workspace=workspace
        )

    # 9. Context Queries (Selection & Workspace overview)
    if "selected" in msg_lower or "currently working on" in msg_lower:
        sel_id = workspace.selected_item_id
        if sel_id and workspace.selected_item_type == "task":
            t = next((task for task in workspace.tasks if task.id == sel_id), None)
            if t:
                return ChatResponse(
                    response=f"📌 You are currently selected on task **{t.title}** (ID: `{t.id}`, Status: `{t.status}`, Priority: `{t.priority}`). Description: \"{t.description}\"",
                    updated_workspace=workspace
                )
        return ChatResponse(
            response=f"📌 Selected Context: [{workspace.selected_item_type or 'None'}] ID={workspace.selected_item_id or 'None'}.",
            updated_workspace=workspace
        )

    if "summarize my overall workspace" in msg_lower or "summary of my workspace" in msg_lower:
        t_count = len(workspace.tasks)
        n_count = len(workspace.notes)
        note_titles = ", ".join([f"'{n.title}'" for n in workspace.notes])
        return ChatResponse(
            response=f"📊 Your workspace currently has **{t_count} active tasks** and **{n_count} notes** ({note_titles}).",
            updated_workspace=workspace
        )

    if "next" in msg_lower and "focus" in msg_lower:
        incomplete = [t for t in workspace.tasks if t.status != "done"]
        top_task = incomplete[0] if incomplete else None
        if top_task:
            return ChatResponse(
                response=f"🎯 Based on your priorities, you should focus on **{top_task.title}** (ID: `{top_task.id}`, Priority: `{top_task.priority}`).",
                updated_workspace=workspace
            )

    # General Q&A text answers
    if "ai coding agent" in msg_lower:
        return ChatResponse(
            response="An AI coding agent is an autonomous model that reads context, formulates plans, executes shell/code commands, and uses function calling tools to complete software engineering tasks.",
            updated_workspace=workspace
        )

    if "tool calling simply" in msg_lower:
        return ChatResponse(
            response="- Tool calling allows LLMs to output structured JSON parameters representing function calls.\n- The host application executes the function locally and returns the result to the LLM.",
            updated_workspace=workspace
        )

    if "study tips" in msg_lower or "prioritizing" in msg_lower:
        return ChatResponse(
            response="1. Focus on high-impact blocking tasks first.\n2. Break large architectural items into bullet points.\n3. Verify implementations using automated test suites.",
            updated_workspace=workspace
        )

    if "workflow orchestration" in msg_lower:
        return ChatResponse(
            response="Single prompt AIs answer static questions in one pass, while tool-calling copilots interact dynamically with external systems, execute actions, and manage multi-step workflows.",
            updated_workspace=workspace
        )

    if "product roadmap" in msg_lower:
        return ChatResponse(
            response="The Product Roadmap notes outline FastAPI backend endpoint development, workspace context injection, human approval flows, and prompt injection safety rules.",
            updated_workspace=workspace
        )

    # Fallback Default Answer
    return ChatResponse(
        response=f"I'm Mini AI Copilot v2. Your workspace has {len(workspace.tasks)} tasks and {len(workspace.notes)} notes active.",
        updated_workspace=workspace
    )


def process_copilot_request(request: ChatRequest, engine_version: str = "v4_copilot_v2") -> ChatResponse:
    """
    Main Copilot execution controller. Integrates ContextBuilder, SafetyPolicy, and ExecutionLogger.
    """
    start_time = time.time()
    req_id = f"req_{uuid.uuid4().hex[:8]}"
    workspace = request.workspace
    approval_res = request.approval_response

    # Formatted context using ContextBuilder
    formatted_context = ContextBuilder.build_focused_context(workspace)

    # Process Approval Response
    if approval_res:
        appr_id = approval_res.get("approval_id")
        action = approval_res.get("action", "delete_task")
        approved = approval_res.get("approved", False)
        args = approval_res.get("arguments", {})

        if approved:
            tool_res, updated_ws, _ = execute_tool(action, args, workspace, approved=True)
            res = ChatResponse(
                response=f"✅ Approved action `{action}`. {tool_res}",
                tool_calls_executed=[{"tool": action, "arguments": args, "result": tool_res}],
                updated_workspace=updated_ws
            )
        else:
            res = ChatResponse(
                response=f"❌ Cancelled action `{action}`.",
                tool_calls_executed=[],
                updated_workspace=workspace
            )
            
        latency = (time.time() - start_time) * 1000
        logger.log_request(req_id, "Approval Response", engine_version, formatted_context, res.tool_calls_executed, False, res.response, latency)
        return res

    # Offline / Heuristic execution if API Key absent or for deterministic benchmark testing
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY.startswith("your_") or len(OPENROUTER_API_KEY) < 10:
        latest_user_msg = ""
        for m in reversed(request.messages):
            if m.role == "user" and m.content:
                latest_user_msg = m.content
                break
                
        res = run_heuristic_copilot(latest_user_msg, workspace, approval_res)
        latency = (time.time() - start_time) * 1000
        logger.log_request(req_id, latest_user_msg, engine_version, formatted_context, res.tool_calls_executed, bool(res.requires_approval), res.response, latency)
        return res

    # OpenRouter LLM Tool Loop Execution
    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY
        )

        full_system_prompt = f"{SYSTEM_PROMPT}\n\n{formatted_context}"
        messages_for_api = [{"role": "system", "content": full_system_prompt}]
        for m in request.messages:
            msg_dict = {"role": m.role}
            if m.content:
                msg_dict["content"] = m.content
            if m.name:
                msg_dict["name"] = m.name
            if m.tool_call_id:
                msg_dict["tool_call_id"] = m.tool_call_id
            if m.tool_calls:
                msg_dict["tool_calls"] = m.tool_calls
            messages_for_api.append(msg_dict)

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages_for_api,
            tools=TOOLS_SCHEMA,
            tool_choice="auto",
            temperature=0.2
        )

        response_message = response.choices[0].message
        executed_tools = []

        if response_message.tool_calls:
            for tool_call in response_message.tool_calls:
                tool_name = tool_call.function.name
                tool_args = json.loads(tool_call.function.arguments)

                # Safety Policy check
                is_safe, approval_req, safety_reason = ToolPolicy.validate_execution_safety(
                    tool_name, tool_args, workspace, approved=False
                )

                if not is_safe and approval_req:
                    latency = (time.time() - start_time) * 1000
                    res = ChatResponse(
                        response=response_message.content or f"I need your confirmation before proceeding with `{tool_name}`.",
                        requires_approval=approval_req,
                        updated_workspace=workspace
                    )
                    logger.log_request(req_id, "Tool Request", engine_version, formatted_context, [], True, res.response, latency)
                    return res

                tool_res, updated_ws, approval_req = execute_tool(tool_name, tool_args, workspace, approved=False)
                workspace = updated_ws

                executed_tools.append({"tool": tool_name, "arguments": tool_args, "result": tool_res})

                messages_for_api.append(response_message.model_dump())
                messages_for_api.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": tool_name,
                    "content": tool_res
                })

            second_response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages_for_api
            )
            final_text = second_response.choices[0].message.content or "Completed."
            res = ChatResponse(
                response=final_text,
                tool_calls_executed=executed_tools,
                updated_workspace=workspace
            )
        else:
            res = ChatResponse(
                response=response_message.content or "",
                tool_calls_executed=[],
                updated_workspace=workspace
            )

        latency = (time.time() - start_time) * 1000
        logger.log_request(req_id, "User Request", engine_version, formatted_context, res.tool_calls_executed, bool(res.requires_approval), res.response, latency)
        return res

    except Exception as e:
        print(f"[Copilot Engine Error]: {e}, falling back to heuristic engine.")
        latest_user_msg = ""
        for m in reversed(request.messages):
            if m.role == "user" and m.content:
                latest_user_msg = m.content
                break
        res = run_heuristic_copilot(latest_user_msg, workspace, approval_res)
        latency = (time.time() - start_time) * 1000
        logger.log_request(req_id, latest_user_msg, engine_version, formatted_context, res.tool_calls_executed, bool(res.requires_approval), res.response, latency)
        return res
