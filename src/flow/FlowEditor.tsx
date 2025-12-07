// src/flow/FlowEditor.tsx
import React, { useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
  type OnConnect,
  ConnectionMode,
} from 'reactflow'

import { nodeTypes } from './nodeTypes'
import { NodePalette } from './panels/NodePalette'
import { PropertiesPanel } from './panels/PropertiesPanel'
import { Toolbar } from './panels/Toolbar'
import { useFlowStore } from './store/useFlowStore'
import type { FlowNode, NodeData } from './types'

import './flow.css'
import 'reactflow/dist/style.css'

function FlowEditorInner() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const reactFlowInstance = useRef<any>(null)

  const {
    nodes,
    edges,
    selectedNodeId,
    setNodes,
    setEdges,
    addNode,
    setSelectedNode,
    addEdge: addEdgeToStore,
  } = useFlowStore()

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes) as FlowNode[])
    },
    [nodes, setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges))
    },
    [edges, setEdges]
  )

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `${params.source}-${params.target}-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
      }
      addEdgeToStore(newEdge)
    },
    [addEdgeToStore]
  )

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (!type || !reactFlowInstance.current) return

      const bounds = reactFlowWrapper.current?.getBoundingClientRect()
      if (!bounds) return

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })

      const id = `${type}-${Date.now()}`
      
      // Default data based on node type
      const defaultData: Record<string, Partial<NodeData>> = {
        start: { label: 'Inicio del Flujo' },
        end: { label: 'Fin del Flujo' },
        action: { label: 'Nueva Acción', actionType: 'process' },
        condition: { label: 'Nueva Condición', conditionType: 'if' },
        io: { label: 'Nueva Entrada/Salida', ioType: 'input', format: 'json' },
        api: { label: 'API Call', method: 'GET', url: '' },
        database: { label: 'Database Query', dbType: 'select', query: '' },
        timer: { label: 'Timer', delay: 5, unit: 'seconds' },
        loop: { label: 'Loop', loopType: 'for', iterations: 10 },
      }

      const newNode: FlowNode = {
        id,
        type,
        position,
        data: (defaultData[type] || { label: `${type} node` }) as NodeData,
      }

      addNode(newNode)
    },
    [addNode]
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowNode) => {
      setSelectedNode(node.id)
    },
    [setSelectedNode]
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected node
      if (e.key === 'Delete' && selectedNodeId) {
        const deleteNode = useFlowStore.getState().deleteNode
        deleteNode(selectedNodeId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId])

  return (
    <div className="flow-container">
      <NodePalette />

      <div
        className="flow-canvas"
        ref={reactFlowWrapper}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={(instance) => {
            reactFlowInstance.current = instance
          }}
          connectionMode={ConnectionMode.Loose}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          }}
          minZoom={0.2}
          maxZoom={4}
        >
          <Background gap={15} size={1} color="#e2e8f0" />
          <Controls
            showInteractive={false}
            style={{
              button: {
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
              },
            }}
          />
          <MiniMap
            className="flow-minimap"
            nodeColor={(node) => {
              const colors: Record<string, string> = {
                start: '#10b981',
                end: '#ef4444',
                action: '#3b82f6',
                condition: '#60a5fa',
                io: '#fbbf24',
                api: '#8b5cf6',
                database: '#a78bfa',
                timer: '#f59e0b',
                loop: '#8b5cf6',
              }
              return colors[node.type || 'action'] || '#94a3b8'
            }}
          />
          
          <Toolbar />
        </ReactFlow>
      </div>

      <PropertiesPanel selectedNode={selectedNode} />

      {/* Execution Log Panel */}
      <ExecutionLogPanel />
    </div>
  )
}

function ExecutionLogPanel() {
  const executionLog = useFlowStore((state) => state.executionLog)
  const clearExecutionLog = useFlowStore((state) => state.clearExecutionLog)

  if (executionLog.length === 0) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        right: 336,
        width: 400,
        maxHeight: 300,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.3)',
        border: '1px solid #334155',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase' }}>
          Log de Ejecución
        </span>
        <button
          onClick={clearExecutionLog}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 4,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1e293b'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          Limpiar
        </button>
      </div>

      <div
        style={{
          overflowY: 'auto',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {executionLog.map((entry, index) => {
          const statusColors = {
            start: { bg: '#1e3a8a', text: '#93c5fd' },
            success: { bg: '#14532d', text: '#86efac' },
            error: { bg: '#7f1d1d', text: '#fca5a5' },
          }
          const colors = statusColors[entry.status]

          return (
            <div
              key={index}
              style={{
                padding: '8px 10px',
                background: colors.bg,
                borderRadius: 6,
                fontSize: 11,
                color: colors.text,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{entry.nodeName}</span>
                <span style={{ opacity: 0.7, fontSize: 10 }}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div style={{ opacity: 0.9 }}>{entry.message}</div>
              {entry.data && (
                <div
                  style={{
                    marginTop: 4,
                    padding: '4px 6px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: 4,
                    fontFamily: 'monospace',
                    fontSize: 10,
                  }}
                >
                  {JSON.stringify(entry.data)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function FlowEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditorInner />
    </ReactFlowProvider>
  )
}