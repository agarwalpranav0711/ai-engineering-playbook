from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

class Task(BaseModel):
    id: str
    title: str
    description: str = ""
    status: Literal["todo", "in_progress", "done"] = "todo"
    priority: Literal["low", "medium", "high"] = "medium"
    tags: List[str] = Field(default_factory=list)
    created_at: str = ""

class Note(BaseModel):
    id: str
    title: str
    content: str = ""
    tags: List[str] = Field(default_factory=list)
    created_at: str = ""

class WorkspaceState(BaseModel):
    tasks: List[Task] = Field(default_factory=list)
    notes: List[Note] = Field(default_factory=list)
    selected_item_id: Optional[str] = None
    selected_item_type: Optional[Literal["task", "note"]] = None
    current_view: str = "all"

class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system", "tool"]
    content: Optional[str] = None
    name: Optional[str] = None
    tool_call_id: Optional[str] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None

class ApprovalRequest(BaseModel):
    approval_id: str
    action: str  # e.g., "delete_task"
    target_id: str
    target_title: Optional[str] = None
    description: str
    arguments: Dict[str, Any]

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    workspace: WorkspaceState
    approval_response: Optional[Dict[str, Any]] = None  # {"approval_id": "...", "approved": bool, "arguments": dict}

class ChatResponse(BaseModel):
    response: str
    tool_calls_executed: List[Dict[str, Any]] = Field(default_factory=list)
    requires_approval: Optional[ApprovalRequest] = None
    updated_workspace: Optional[WorkspaceState] = None
