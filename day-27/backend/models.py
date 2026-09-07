from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field


class NodePosition(BaseModel):
    x: float = 0.0
    y: float = 0.0


class WorkflowNode(BaseModel):
    id: str
    type: str = Field(..., description="Node type: input, prompt, ai, output")
    data: Dict[str, Any] = Field(default_factory=dict)
    position: Optional[NodePosition] = None


class WorkflowEdge(BaseModel):
    id: str
    source: str = Field(..., description="ID of source node")
    target: str = Field(..., description="ID of target node")
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class Workflow(BaseModel):
    id: Optional[str] = "workflow-1"
    name: Optional[str] = "Untitled Workflow"
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]


class ExecutionRequest(BaseModel):
    workflow: Workflow
    inputs: Optional[Dict[str, Any]] = None


class ExecutionStep(BaseModel):
    node_id: str
    node_type: str
    node_label: str
    status: str
    input_data: Any = None
    output_data: Any = None
    execution_time_seconds: float = 0.0
    error: Optional[str] = None


class ExecutionResponse(BaseModel):
    success: bool
    output: str
    execution_time_seconds: float
    steps: List[ExecutionStep] = Field(default_factory=list)
    node_outputs: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
