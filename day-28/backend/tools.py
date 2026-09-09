import uuid
from datetime import datetime
from typing import Dict, Any, Tuple, Optional
from models import WorkspaceState, Task, Note, ApprovalRequest

# Tool Definitions formatted for OpenAI Chat Completions API
TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "create_task",
            "description": "Create a new task in the workspace.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "The title of the task"},
                    "description": {"type": "string", "description": "Detailed description or notes for the task"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high"], "description": "Priority level"},
                    "tags": {"type": "array", "items": {"type": "string"}, "description": "Tags or categories"}
                },
                "required": ["title"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update an existing task's title, status, priority, or description.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "string", "description": "ID of the task to update"},
                    "title": {"type": "string", "description": "New title"},
                    "status": {"type": "string", "enum": ["todo", "in_progress", "done"], "description": "Task status"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high"], "description": "Priority level"},
                    "description": {"type": "string", "description": "New description"}
                },
                "required": ["task_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task from the workspace. REQUIRES HUMAN APPROVAL.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "string", "description": "ID of the task to delete"}
                },
                "required": ["task_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_note",
            "description": "Create a new note in the workspace.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "Title of the note"},
                    "content": {"type": "string", "description": "Main body content of the note"},
                    "tags": {"type": "array", "items": {"type": "string"}, "description": "Tags for the note"}
                },
                "required": ["title"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_note",
            "description": "Update an existing note's title or content.",
            "parameters": {
                "type": "object",
                "properties": {
                    "note_id": {"type": "string", "description": "ID of the note to update"},
                    "title": {"type": "string", "description": "Updated title"},
                    "content": {"type": "string", "description": "Updated content body"}
                },
                "required": ["note_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_workspace",
            "description": "Search across tasks and notes using keyword search.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Keyword search term"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "extract_tasks_from_note",
            "description": "Parse a note's content to extract bullet points/action items and create tasks for them automatically.",
            "parameters": {
                "type": "object",
                "properties": {
                    "note_id": {"type": "string", "description": "ID of the note to convert into tasks"}
                },
                "required": ["note_id"]
            }
        }
    }
]

def execute_tool(
    name: str,
    arguments: Dict[str, Any],
    workspace: WorkspaceState,
    approved: bool = False
) -> Tuple[str, WorkspaceState, Optional[ApprovalRequest]]:
    """
    Executes a requested tool on the workspace state.
    Returns (tool_result_string, updated_workspace, approval_request_if_needed).
    """
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    # DESTRUCTIVE ACTIONS REQUIRING APPROVAL
    if name == "delete_task" and not approved:
        task_id = arguments.get("task_id")
        target_task = next((t for t in workspace.tasks if t.id == task_id), None)
        title = target_task.title if target_task else f"Task #{task_id}"
        
        approval_req = ApprovalRequest(
            approval_id=f"appr_{uuid.uuid4().hex[:8]}",
            action="delete_task",
            target_id=task_id,
            target_title=title,
            description=f"Are you sure you want to permanently delete the task '{title}'?",
            arguments=arguments
        )
        return (
            f"Action delete_task for task ID '{task_id}' requires user approval.",
            workspace,
            approval_req
        )

    if name == "create_task":
        new_task = Task(
            id=f"task_{uuid.uuid4().hex[:6]}",
            title=arguments.get("title", "Untitled Task"),
            description=arguments.get("description", ""),
            status="todo",
            priority=arguments.get("priority", "medium"),
            tags=arguments.get("tags", []),
            created_at=now_str
        )
        workspace.tasks.append(new_task)
        return f"Successfully created task '{new_task.title}' with ID {new_task.id}.", workspace, None

    elif name == "update_task":
        task_id = arguments.get("task_id")
        target_task = next((t for t in workspace.tasks if t.id == task_id), None)
        if not target_task:
            return f"Error: Task with ID '{task_id}' not found.", workspace, None
        
        if "title" in arguments:
            target_task.title = arguments["title"]
        if "status" in arguments:
            target_task.status = arguments["status"]
        if "priority" in arguments:
            target_task.priority = arguments["priority"]
        if "description" in arguments:
            target_task.description = arguments["description"]
            
        return f"Successfully updated task '{target_task.title}' (ID: {task_id}).", workspace, None

    elif name == "delete_task" and approved:
        task_id = arguments.get("task_id")
        before_len = len(workspace.tasks)
        workspace.tasks = [t for t in workspace.tasks if t.id != task_id]
        if len(workspace.tasks) < before_len:
            if workspace.selected_item_id == task_id:
                workspace.selected_item_id = None
                workspace.selected_item_type = None
            return f"Task ID '{task_id}' was successfully deleted.", workspace, None
        return f"Task ID '{task_id}' was not found.", workspace, None

    elif name == "create_note":
        new_note = Note(
            id=f"note_{uuid.uuid4().hex[:6]}",
            title=arguments.get("title", "Untitled Note"),
            content=arguments.get("content", ""),
            tags=arguments.get("tags", []),
            created_at=now_str
        )
        workspace.notes.append(new_note)
        return f"Successfully created note '{new_note.title}' with ID {new_note.id}.", workspace, None

    elif name == "update_note":
        note_id = arguments.get("note_id")
        target_note = next((n for n in workspace.notes if n.id == note_id), None)
        if not target_note:
            return f"Error: Note with ID '{note_id}' not found.", workspace, None
        
        if "title" in arguments:
            target_note.title = arguments["title"]
        if "content" in arguments:
            target_note.content = arguments["content"]
            
        return f"Successfully updated note '{target_note.title}' (ID: {note_id}).", workspace, None

    elif name == "search_workspace":
        query = arguments.get("query", "").lower()
        matched_tasks = [t.title for t in workspace.tasks if query in t.title.lower() or query in t.description.lower()]
        matched_notes = [n.title for n in workspace.notes if query in n.title.lower() or query in n.content.lower()]
        res = f"Search results for '{query}': Found {len(matched_tasks)} tasks ({', '.join(matched_tasks) or 'None'}) and {len(matched_notes)} notes ({', '.join(matched_notes) or 'None'})."
        return res, workspace, None

    elif name == "extract_tasks_from_note":
        note_id = arguments.get("note_id")
        target_note = next((n for n in workspace.notes if n.id == note_id), None)
        if not target_note:
            return f"Error: Note with ID '{note_id}' not found.", workspace, None
        
        lines = [l.strip() for l in target_note.content.split("\n") if l.strip()]
        created_titles = []
        for line in lines:
            # Look for bullet points or numbered lists
            cleaned = line.lstrip("-*•1234567890. ").strip()
            if cleaned:
                t = Task(
                    id=f"task_{uuid.uuid4().hex[:6]}",
                    title=cleaned,
                    description=f"Extracted from note: {target_note.title}",
                    status="todo",
                    priority="medium",
                    created_at=now_str
                )
                workspace.tasks.append(t)
                created_titles.append(t.title)
        
        return f"Extracted {len(created_titles)} tasks from note '{target_note.title}': {', '.join(created_titles)}.", workspace, None

    return f"Unknown tool name: {name}", workspace, None
