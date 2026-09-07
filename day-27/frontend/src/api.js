/**
 * API client service for FastAPI Backend
 */

export async function runWorkflowAPI(workflow, inputs = {}) {
  const response = await fetch('/api/workflow/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workflow,
      inputs,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to run workflow' }));
    throw new Error(errorData.detail || 'Workflow execution error');
  }

  return await response.json();
}

export async function validateWorkflowAPI(workflow) {
  const response = await fetch('/api/workflow/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflow),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Validation failed' }));
    throw new Error(errorData.detail || 'Validation error');
  }

  return await response.json();
}

export async function checkBackendHealthAPI() {
  try {
    const response = await fetch('/api/health');
    return response.ok;
  } catch (err) {
    return false;
  }
}
