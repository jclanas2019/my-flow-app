// src/flow/nodeTypes/ActionNode.tsx
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types'

export function ActionNode({ data, selected }: NodeProps<NodeData>) {
  const actionTypeIcons: Record<string, string> = {
    transform: '🔄',
    process: '⚙️',
    validate: '✓',
  }

  const icon = data.actionType ? actionTypeIcons[data.actionType] || '⚡' : '⚡'

  return (
    <div
      style={{
        padding: 12,
        background: '#ffffff',
        borderRadius: 10,
        border: selected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        boxShadow: selected
          ? '0 6px 20px rgba(59, 130, 246, 0.25)'
          : '0 2px 6px rgba(15, 23, 42, 0.1)',
        fontSize: 12,
        minWidth: 160,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <strong style={{ color: '#111827', fontSize: 11, textTransform: 'uppercase' }}>
          Acción
        </strong>
      </div>
      
      <div style={{ fontSize: 12, color: '#374151', marginBottom: 4, fontWeight: 500 }}>
        {data.label}
      </div>
      
      {data.description && (
        <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 6 }}>
          {data.description}
        </div>
      )}

      {data.actionType && (
        <div
          style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: '#eff6ff',
            color: '#1e40af',
            fontSize: 10,
            fontWeight: 500,
            display: 'inline-block',
          }}
        >
          {data.actionType}
        </div>
      )}

      {data.status && (
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 4,
            background:
              data.status === 'completed'
                ? '#d1fae5'
                : data.status === 'error'
                ? '#fee2e2'
                : data.status === 'running'
                ? '#dbeafe'
                : '#f3f4f6',
            color:
              data.status === 'completed'
                ? '#065f46'
                : data.status === 'error'
                ? '#991b1b'
                : data.status === 'running'
                ? '#1e40af'
                : '#374151',
            display: 'inline-block',
          }}
        >
          {data.status}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 10, height: 10, background: '#3b82f6' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 10, height: 10, background: '#3b82f6' }}
      />
    </div>
  )
}