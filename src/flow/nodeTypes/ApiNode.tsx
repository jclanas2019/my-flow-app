// src/flow/nodeTypes/ApiNode.tsx
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types'

export function ApiNode({ data, selected }: NodeProps<NodeData>) {
  const methodColors: Record<string, string> = {
    GET: '#3b82f6',
    POST: '#10b981',
    PUT: '#f59e0b',
    DELETE: '#ef4444',
  }

  const method = data.method || 'GET'
  const color = methodColors[method]

  return (
    <div
      style={{
        padding: 12,
        background: '#ffffff',
        borderRadius: 10,
        border: selected ? `2px solid ${color}` : '1px solid #e5e7eb',
        boxShadow: selected
          ? `0 6px 20px ${color}33`
          : '0 2px 6px rgba(15, 23, 42, 0.1)',
        fontSize: 12,
        minWidth: 180,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div
          style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: color,
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {method}
        </div>
        <strong style={{ color: '#111827' }}>API Call</strong>
      </div>
      
      <div style={{ fontSize: 12, color: '#374151', marginBottom: 4 }}>
        {data.label}
      </div>
      
      {data.url && (
        <div
          style={{
            fontSize: 10,
            color: '#6b7280',
            fontFamily: 'monospace',
            background: '#f9fafb',
            padding: '4px 6px',
            borderRadius: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.url}
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
        style={{ width: 10, height: 10, background: color }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 10, height: 10, background: color }}
      />
    </div>
  )
}