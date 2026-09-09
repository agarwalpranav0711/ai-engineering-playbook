from typing import Dict, Any, Tuple, Optional
from models import WorkspaceState, ApprovalRequest, Task
import uuid

class ToolPolicy:
    READ_TOOLS = {"search_workspace"}
    WRITE_TOOLS = {"create_task", "update_task", "create_note", "update_note", "extract_tasks_from_note"}
    DESTRUCTIVE_TOOLS = {"delete_task", "delete_note"}

    @classmethod
    def is_destructive(cls, tool_name: str) -> bool:
        return tool_name in cls.DESTRUCTIVE_TOOLS

    @classmethod
    def validate_execution_safety(
        cls,
        tool_name: str,
        arguments: Dict[str, Any],
        workspace: WorkspaceState,
        approved: bool = False
    ) -> Tuple[bool, Optional[ApprovalRequest], str]:
        """
        Validates whether a tool execution is safe to proceed.
        Returns (is_allowed, approval_request_or_none, reason_string).
        """
        if cls.is_destructive(tool_name) and not approved:
            task_id = arguments.get("task_id")
            target_title = None
            if task_id:
                t = next((task for task in workspace.tasks if task.id == task_id), None)
                if t:
                    target_title = t.title
            
            appr = ApprovalRequest(
                approval_id=f"appr_{uuid.uuid4().hex[:8]}",
                action=tool_name,
                target_id=task_id or "unknown",
                target_title=target_title or f"Item {task_id}",
                description=f"Action '{tool_name}' requires human approval before proceeding.",
                arguments=arguments
            )
            return False, appr, f"Action '{tool_name}' intercepted: requires human-in-the-loop approval."

        return True, None, "Execution safety check passed."
