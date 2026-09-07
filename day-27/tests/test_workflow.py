import json
import pytest
from pathlib import Path
import sys

# Add backend directory to sys.path
backend_path = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from models import Workflow, WorkflowNode, WorkflowEdge
from executor import WorkflowExecutor


@pytest.fixture
def executor():
    return WorkflowExecutor()


def test_valid_linear_workflow_execution(executor):
    sample_path = Path(__file__).resolve().parent.parent / "sample-data" / "basic.json"
    with open(sample_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    workflow = Workflow(**data)
    response = executor.execute_workflow(workflow)

    assert response.success is True
    assert response.error is None
    assert len(response.steps) == 4
    assert response.output != ""


def test_variable_substitution(executor):
    template = "Write a comprehensive review on {{topic}} for {{audience}}."
    context = {"topic": "Neural Networks", "audience": "beginners"}
    result = executor.perform_variable_substitution(template, context)

    assert result == "Write a comprehensive review on Neural Networks for beginners."


def test_multi_ai_pipeline_execution(executor):
    sample_path = Path(__file__).resolve().parent.parent / "sample-data" / "multi-ai.json"
    with open(sample_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    workflow = Workflow(**data)
    response = executor.execute_workflow(workflow)

    assert response.success is True
    assert len(response.steps) == 6
    assert "node-3" in response.node_outputs
    assert "node-5" in response.node_outputs


def test_missing_input_or_output_node_validation(executor):
    # Workflow without Input node
    invalid_workflow = Workflow(
        id="invalid-1",
        nodes=[
            WorkflowNode(id="n1", type="ai", data={"prompt": "Hello"}),
            WorkflowNode(id="n2", type="output", data={})
        ],
        edges=[WorkflowEdge(id="e1", source="n1", target="n2")]
    )
    sorted_nodes, errors = executor.validate_and_sort(invalid_workflow)
    assert len(errors) > 0
    assert any("Input node" in err for err in errors)


def test_cycle_detection(executor):
    # Workflow with a cycle (n1 -> n2 -> n3 -> n2)
    cycle_workflow = Workflow(
        id="cycle-wf",
        nodes=[
            WorkflowNode(id="n1", type="input", data={"name": "x", "value": "1"}),
            WorkflowNode(id="n2", type="prompt", data={"template": "{{x}}"}),
            WorkflowNode(id="n3", type="ai", data={}),
            WorkflowNode(id="n4", type="output", data={})
        ],
        edges=[
            WorkflowEdge(id="e1", source="n1", target="n2"),
            WorkflowEdge(id="e2", source="n2", target="n3"),
            WorkflowEdge(id="e3", source="n3", target="n2"),  # Cycle!
            WorkflowEdge(id="e4", source="n3", target="n4"),
        ]
    )
    sorted_nodes, errors = executor.validate_and_sort(cycle_workflow)
    assert len(errors) > 0
    assert any("cycle" in err.lower() for err in errors)
