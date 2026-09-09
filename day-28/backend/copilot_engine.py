import os
import json
from typing import Dict, Any, List
from dotenv import load_dotenv
from openai import OpenAI

from models import ChatRequest, ChatResponse, WorkspaceState, ChatMessage, ApprovalRequest
from prompts import SYSTEM_PROMPT, format_workspace_context
from tools import TOOLS_SCHEMA, execute_tool

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "openai/gpt-4o-mini")

def run_heuristic_copilot(
    user_message: str,
    workspace: WorkspaceState,
    approval_response: Dict[str, Any] = None
) -> ChatResponse:
    """
    Fallback deterministic engine when API Key is absent or offline.
    Parses user input for key intent patterns (create task, mark done, delete, summarize, search).
    """
    msg_lower = user_message.lower().strip()
    executed_tools = []
    
    # Check approval response
    if approval_response:
        appr_args = approval_response.get("arguments", {})
        if approval_response.get("approved"):
            tool_res, workspace, _ = execute_tool("delete_task", appr_args, workspace, approved=True)
            executed_tools.append({"tool": "delete_task", "result": tool_res})
            return ChatResponse(
                response=f"✅ Approved! {tool_res}",
                tool_calls_executed=executed_tools,
                updated_workspace=workspace
            )
        else:
            return ChatResponse(
                response="❌ Action cancelled. The task was not deleted.",
                tool_calls_executed=[],
                updated_workspace=workspace
            )

    # 1. Delete Task (Triggers approval)
    if "delete" in msg_lower and ("task" in msg_lower or "item" in msg_lower or workspace.selected_item_id):
        # Find task to delete
        target_task = None
        if workspace.selected_item_id and workspace.selected_item_type == "task":
            target_task = next((t for t in workspace.tasks if t.id == workspace.selected_item_id), None)
        if not target_task:
            for t in workspace.tasks:
                if t.title.lower() in msg_lower:
                    target_task = t
                    break
        if not target_task and workspace.tasks:
            target_task = workspace.tasks[0]

        if target_task:
            tool_res, workspace, approval_req = execute_tool("delete_task", {"task_id": target_task.id}, workspace, approved=False)
            return ChatResponse(
                response=f"I require your confirmation to delete task '{target_task.title}'.",
                tool_calls_executed=[],
                requires_approval=approval_req,
                updated_workspace=workspace
            )
        return ChatResponse(
            response="Could not find a task matching your delete request.",
            updated_workspace=workspace
        )

    # 2. Add / Create Task
    if any(k in msg_lower for k in ["create task", "add task", "new task", "remind me to", "todo"]):
        clean_title = user_message
        for prefix in ["create task", "add task", "new task", "remind me to"]:
            if prefix in clean_title.lower():
                idx = clean_title.lower().find(prefix) + len(prefix)
                clean_title = clean_title[idx:].strip(" :")
                break
        if not clean_title:
            clean_title = "New Task"
            
        tool_res, workspace, _ = execute_tool("create_task", {"title": clean_title, "priority": "medium"}, workspace)
        executed_tools.append({"tool": "create_task", "result": tool_res})
        return ChatResponse(
            response=f"✨ Created task: **{clean_title}**",
            tool_calls_executed=executed_tools,
            updated_workspace=workspace
        )

    # 3. Create Note
    if any(k in msg_lower for k in ["create note", "add note", "new note", "take a note"]):
        clean_title = user_message
        for prefix in ["create note", "add note", "new note", "take a note"]:
            if prefix in clean_title.lower():
                idx = clean_title.lower().find(prefix) + len(prefix)
                clean_title = clean_title[idx:].strip(" :")
                break
        if not clean_title:
            clean_title = "Quick Note"

        tool_res, workspace, _ = execute_tool("create_note", {"title": clean_title, "content": ""}, workspace)
        executed_tools.append({"tool": "create_note", "result": tool_res})
        return ChatResponse(
            response=f"📝 Created note: **{clean_title}**",
            tool_calls_executed=executed_tools,
            updated_workspace=workspace
        )

    # 4. Mark Done / Update status
    if "done" in msg_lower or "complete" in msg_lower or "finish" in msg_lower:
        target_task = None
        if workspace.selected_item_id and workspace.selected_item_type == "task":
            target_task = next((t for t in workspace.tasks if t.id == workspace.selected_item_id), None)
        if not target_task and workspace.tasks:
            target_task = workspace.tasks[0]

        if target_task:
            tool_res, workspace, _ = execute_tool("update_task", {"task_id": target_task.id, "status": "done"}, workspace)
            executed_tools.append({"tool": "update_task", "result": tool_res})
            return ChatResponse(
                response=f"🎉 Marked task **'{target_task.title}'** as done!",
                tool_calls_executed=executed_tools,
                updated_workspace=workspace
            )

    # 5. Extract tasks from note
    if "extract" in msg_lower and "note" in msg_lower:
        target_note = None
        if workspace.selected_item_id and workspace.selected_item_type == "note":
            target_note = next((n for n in workspace.notes if n.id == workspace.selected_item_id), None)
        if not target_note and workspace.notes:
            target_note = workspace.notes[0]

        if target_note:
            tool_res, workspace, _ = execute_tool("extract_tasks_from_note", {"note_id": target_note.id}, workspace)
            executed_tools.append({"tool": "extract_tasks_from_note", "result": tool_res})
            return ChatResponse(
                response=f"📋 {tool_res}",
                tool_calls_executed=executed_tools,
                updated_workspace=workspace
            )

    # Default Contextual Answer
    tasks_count = len(workspace.tasks)
    notes_count = len(workspace.notes)
    sel_info = f"Selected item: [{workspace.selected_item_type}] {workspace.selected_item_id}" if workspace.selected_item_id else "No item selected."

    reply = (
        f"I'm your **Mini AI Copilot**! Currently your workspace has **{tasks_count} tasks** and **{notes_count} notes**.\n"
        f"Status: {sel_info}\n\n"
        f"You can ask me to:\n"
        f"- Add a task (e.g. `add task Test frontend components`)\n"
        f"- Mark a task complete (e.g. `complete task`)\n"
        f"- Delete a task (triggers human confirmation flow)\n"
        f"- Create or summarize notes\n"
        f"- Extract tasks from a note"
    )
    return ChatResponse(response=reply, updated_workspace=workspace)


def process_copilot_request(request: ChatRequest) -> ChatResponse:
    """
    Main Copilot execution controller.
    Uses OpenRouter API if OPENROUTER_API_KEY is configured; falls back to heuristic engine cleanly otherwise.
    """
    workspace = request.workspace
    approval_res = request.approval_response

    # If approval response is passed from client, process it directly
    if approval_res:
        appr_id = approval_res.get("approval_id")
        action = approval_res.get("action", "delete_task")
        approved = approval_res.get("approved", False)
        args = approval_res.get("arguments", {})

        if approved:
            tool_res, updated_ws, _ = execute_tool(action, args, workspace, approved=True)
            return ChatResponse(
                response=f"✅ Approved action `{action}`. {tool_res}",
                tool_calls_executed=[{"tool": action, "arguments": args, "result": tool_res}],
                updated_workspace=updated_ws
            )
        else:
            return ChatResponse(
                response=f"❌ Cancelled action `{action}`.",
                tool_calls_executed=[],
                updated_workspace=workspace
            )

    # Check for valid API key
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY.startswith("your_") or len(OPENROUTER_API_KEY) < 10:
        latest_user_msg = ""
        for m in reversed(request.messages):
            if m.role == "user" and m.content:
                latest_user_msg = m.content
                break
        return run_heuristic_copilot(latest_user_msg, workspace, approval_res)

    # OpenRouter LLM Tool Loop Execution
    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY
        )

        formatted_context = format_workspace_context(workspace.model_dump())
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

        # First Call to LLM
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages_for_api,
            tools=TOOLS_SCHEMA,
            tool_choice="auto",
            temperature=0.2
        )

        response_message = response.choices[0].message
        executed_tools = []
        requires_approval = None

        if response_message.tool_calls:
            # Handle tool call
            for tool_call in response_message.tool_calls:
                tool_name = tool_call.function.name
                tool_args = json.loads(tool_call.function.arguments)

                tool_res, updated_ws, approval_req = execute_tool(tool_name, tool_args, workspace, approved=False)
                workspace = updated_ws

                if approval_req:
                    requires_approval = approval_req
                    return ChatResponse(
                        response=response_message.content or f"I need your permission to run `{tool_name}`.",
                        requires_approval=requires_approval,
                        updated_workspace=workspace
                    )

                executed_tools.append({"tool": tool_name, "arguments": tool_args, "result": tool_res})

                # Append assistant tool call and tool result message for follow-up completion
                messages_for_api.append(response_message.model_dump())
                messages_for_api.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": tool_name,
                    "content": tool_res
                })

            # Second call to synthesize final user-facing response after tool execution
            second_response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages_for_api
            )
            final_text = second_response.choices[0].message.content or "Done!"
            return ChatResponse(
                response=final_text,
                tool_calls_executed=executed_tools,
                updated_workspace=workspace
            )
        else:
            return ChatResponse(
                response=response_message.content or "",
                tool_calls_executed=[],
                updated_workspace=workspace
            )

    except Exception as e:
        print(f"[Copilot Engine Error]: {e}, falling back to heuristic engine.")
        latest_user_msg = ""
        for m in reversed(request.messages):
            if m.role == "user" and m.content:
                latest_user_msg = m.content
                break
        return run_heuristic_copilot(latest_user_msg, workspace, approval_res)
