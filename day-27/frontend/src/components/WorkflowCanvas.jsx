import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';

import InputNode from '../nodes/InputNode';
import PromptNode from '../nodes/PromptNode';
import AINode from '../nodes/AINode';
import OutputNode from '../nodes/OutputNode';

export default function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
}) {
  const nodeTypes = useMemo(
    () => ({
      input: InputNode,
      prompt: PromptNode,
      ai: AINode,
      output: OutputNode,
    }),
    []
  );

  return (
    <div className="flex-1 h-full w-full relative bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2.5 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="m-4" />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'input': return '#10b981';
              case 'prompt': return '#f59e0b';
              case 'ai': return '#6366f1';
              case 'output': return '#06b6d4';
              default: return '#64748b';
            }
          }}
          maskColor="rgba(3, 7, 18, 0.7)"
          className="!bg-slate-900/90 !border !border-slate-800 !rounded-xl !overflow-hidden m-4"
        />
      </ReactFlow>
    </div>
  );
}
