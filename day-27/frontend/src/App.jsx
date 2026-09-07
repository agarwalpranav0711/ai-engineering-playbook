import React, { useState, useEffect, useCallback } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider
} from '@xyflow/react';

import Header from './components/Header';
import NodePanel from './components/NodePanel';
import WorkflowCanvas from './components/WorkflowCanvas';
import SettingsPanel from './components/SettingsPanel';
import ExecutionResult from './components/ExecutionResult';

import { runWorkflowAPI, checkBackendHealthAPI } from './api';

// Initial Preset Workflows
const PRESETS = {
  basic: {
    id: 'workflow-basic',
    name: '1. Basic Workflow',
    nodes: [
      { id: 'node-1', type: 'input', position: { x: 50, y: 150 }, data: { label: 'Input: Topic', name: 'topic', value: 'AI Engineering' } },
      { id: 'node-2', type: 'prompt', position: { x: 340, y: 150 }, data: { label: 'Prompt Generator', template: 'Write a short 2-sentence explanation about {{topic}}.' } },
      { id: 'node-3', type: 'ai', position: { x: 670, y: 150 }, data: { label: 'AI Model (GPT-4o-mini)', model: 'openai/gpt-4o-mini', temperature: 0.7 } },
      { id: 'node-4', type: 'output', position: { x: 1000, y: 150 }, data: { label: 'Final Output' } }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' }
    ]
  },
  summarizer: {
    id: 'workflow-summarizer',
    name: '2. Summarizer',
    nodes: [
      { id: 'node-1', type: 'input', position: { x: 50, y: 150 }, data: { label: 'Input Text', name: 'text', value: 'Visual AI workflow builders allow developers to visually compose AI applications using node graphs instead of hardcoding prompt pipelines in code.' } },
      { id: 'node-2', type: 'prompt', position: { x: 340, y: 150 }, data: { label: 'Summarizer Prompt', template: 'Summarize the following text into 3 key takeaways:\n\n{{text}}' } },
      { id: 'node-3', type: 'ai', position: { x: 670, y: 150 }, data: { label: 'Claude 3.5 Sonnet', model: 'anthropic/claude-3.5-sonnet', temperature: 0.3 } },
      { id: 'node-4', type: 'output', position: { x: 1000, y: 150 }, data: { label: 'Summary Result' } }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' }
    ]
  },
  translator: {
    id: 'workflow-translator',
    name: '3. Translator',
    nodes: [
      { id: 'node-1', type: 'input', position: { x: 50, y: 150 }, data: { label: 'Input Text', name: 'text', value: 'Workflow orchestration visually connects individual AI nodes into an automated graph pipeline.' } },
      { id: 'node-2', type: 'prompt', position: { x: 340, y: 150 }, data: { label: 'Hindi Prompt', template: 'Translate this sentence into fluent Hindi:\n\n{{text}}' } },
      { id: 'node-3', type: 'ai', position: { x: 670, y: 150 }, data: { label: 'Gemini 2.5 Flash', model: 'google/gemini-2.5-flash', temperature: 0.2 } },
      { id: 'node-4', type: 'output', position: { x: 1000, y: 150 }, data: { label: 'Hindi Output' } }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' }
    ]
  },
  email: {
    id: 'workflow-email',
    name: '4. Email Generator',
    nodes: [
      { id: 'node-1', type: 'input', position: { x: 50, y: 150 }, data: { label: 'Situation Context', name: 'message', value: 'Project deadline extension requested due to unexpected API integration testing.' } },
      { id: 'node-2', type: 'prompt', position: { x: 340, y: 150 }, data: { label: 'Email Prompt', template: 'Draft a polite and professional email requesting a 2-day extension for: {{message}}' } },
      { id: 'node-3', type: 'ai', position: { x: 670, y: 150 }, data: { label: 'AI Writer', model: 'openai/gpt-4o-mini', temperature: 0.5 } },
      { id: 'node-4', type: 'output', position: { x: 1000, y: 150 }, data: { label: 'Final Email Draft' } }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' }
    ]
  },
  'multi-ai': {
    id: 'workflow-multi-ai',
    name: '5. Multi-AI Pipeline',
    nodes: [
      { id: 'node-1', type: 'input', position: { x: 40, y: 150 }, data: { label: 'Input Concept', name: 'topic', value: 'Quantum Computing' } },
      { id: 'node-2', type: 'prompt', position: { x: 320, y: 150 }, data: { label: 'Prompt 1', template: 'Draft a rough explanation about {{topic}}.' } },
      { id: 'node-3', type: 'ai', position: { x: 600, y: 150 }, data: { label: 'AI 1 (Drafter)', model: 'openai/gpt-4o-mini', temperature: 0.7 } },
      { id: 'node-4', type: 'prompt', position: { x: 880, y: 150 }, data: { label: 'Prompt 2', template: 'Refine and improve the following draft:\n\n{{last_output}}' } },
      { id: 'node-5', type: 'ai', position: { x: 1160, y: 150 }, data: { label: 'AI 2 (Refiner)', model: 'anthropic/claude-3.5-sonnet', temperature: 0.3 } },
      { id: 'node-6', type: 'output', position: { x: 1440, y: 150 }, data: { label: 'Final Refined Result' } }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
      { id: 'e4-5', source: 'node-4', target: 'node-5' },
      { id: 'e5-6', source: 'node-5', target: 'node-6' }
    ]
  }
};

function WorkflowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(PRESETS.basic.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(PRESETS.basic.edges);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('basic');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);

  // Check backend health periodically
  useEffect(() => {
    checkBackendHealthAPI().then(setBackendConnected);
    const interval = setInterval(() => {
      checkBackendHealthAPI().then(setBackendConnected);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle edge connections
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1', strokeWidth: 2.5 } }, eds)),
    [setEdges]
  );

  // Select node for settings panel
  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Add new node to canvas
  const handleAddNode = (type) => {
    const newId = `node-${Date.now()}`;
    const xPos = 100 + nodes.length * 50;
    const yPos = 150 + (nodes.length % 3) * 60;

    let defaultData = { label: `${type.toUpperCase()} Node` };
    if (type === 'input') defaultData = { label: 'Input Node', name: 'var_1', value: 'Sample Data' };
    if (type === 'prompt') defaultData = { label: 'Prompt Node', template: 'Write about {{var_1}}:' };
    if (type === 'ai') defaultData = { label: 'AI Model Node', model: 'openai/gpt-4o-mini', temperature: 0.7 };
    if (type === 'output') defaultData = { label: 'Output Terminal' };

    const newNode = {
      id: newId,
      type,
      position: { x: xPos, y: yPos },
      data: defaultData
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newId);
  };

  // Update node data properties
  const handleUpdateNodeData = (nodeId, updatedFields) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...updatedFields }
          };
        }
        return node;
      })
    );
  };

  // Delete node
  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // Load preset
  const handleLoadPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setNodes(preset.nodes);
      setEdges(preset.edges);
      setSelectedPreset(presetKey);
      setSelectedNodeId(null);
      setExecutionResult(null);
    }
  };

  // Save workflow to localStorage
  const handleSaveWorkflow = () => {
    const workflowObj = { nodes, edges };
    localStorage.setItem('day27_ai_workflow', JSON.stringify(workflowObj));
    alert('Workflow saved successfully to browser localStorage!');
  };

  // Load workflow from localStorage
  const handleLoadSavedWorkflow = () => {
    const saved = localStorage.getItem('day27_ai_workflow');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNodes(parsed.nodes || []);
        setEdges(parsed.edges || []);
        setSelectedNodeId(null);
        setExecutionResult(null);
      } catch (err) {
        alert('Failed to parse saved workflow.');
      }
    } else {
      alert('No saved workflow found in localStorage.');
    }
  };

  // Clear canvas
  const handleClearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setExecutionResult(null);
  };

  // Execute workflow
  const handleRunWorkflow = async () => {
    setIsExecuting(true);
    setExecutionResult(null);

    const workflowPayload = {
      id: 'workflow-client',
      name: 'Client Active Workflow',
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        data: n.data,
        position: n.position
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target
      }))
    };

    try {
      const result = await runWorkflowAPI(workflowPayload);
      setExecutionResult(result);

      // If execution was successful, update Output nodes with final result!
      if (result.success && result.output) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.type === 'output') {
              return {
                ...node,
                data: { ...node.data, output_value: result.output }
              };
            }
            return node;
          })
        );
      }
    } catch (err) {
      setExecutionResult({
        success: false,
        output: '',
        execution_time_seconds: 0,
        steps: [],
        error: err.message || 'Workflow execution failed.'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const workflowJson = {
    nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data, position: n.position })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target }))
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden text-slate-100">
      {/* Header Bar */}
      <Header
        isExecuting={isExecuting}
        backendConnected={backendConnected}
        onRunWorkflow={handleRunWorkflow}
        onLoadPreset={handleLoadPreset}
        onSaveWorkflow={handleSaveWorkflow}
        onLoadSavedWorkflow={handleLoadSavedWorkflow}
        onClearCanvas={handleClearCanvas}
        onToggleJsonModal={() => setShowJsonModal(true)}
        selectedPreset={selectedPreset}
      />

      {/* Main Workspace Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Palette */}
        <NodePanel onAddNode={handleAddNode} />

        {/* Center Interactive Graph Canvas */}
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
        />

        {/* Right Settings Inspector */}
        <SettingsPanel
          selectedNode={selectedNode}
          onUpdateNodeData={handleUpdateNodeData}
          onDeleteNode={handleDeleteNode}
        />

        {/* Execution Results Overlay / Modal */}
        <ExecutionResult
          executionResult={executionResult}
          workflowJson={workflowJson}
          showJsonModal={showJsonModal}
          onCloseJsonModal={() => setShowJsonModal(false)}
          onCloseResult={() => setExecutionResult(null)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowApp />
    </ReactFlowProvider>
  );
}
