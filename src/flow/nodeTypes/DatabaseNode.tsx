// src/flow/nodeTypes/DatabaseNode.tsx
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types'

export function DatabaseNode({ data, selected }: NodeProps<NodeData>) {
  const dbTypeColors: Record<string, string> = {
    select: '#8b5cf6',
    insert: '#10b981',
    update: '#f59e0b',
    delete: '#ef4444',
  }

  const dbType = data.dbType || 'select'
  const color = dbTypeColors[dbType]

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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5V19C3 20.6569 7.02944 22 12 22C16.9706 22 21 20.6569 21 19V5" />
          <path d="M3 12C3 13.6569 7.02944 15 12 15C16.9706 15 21 13.6569 21 12" />
        </svg>
        <strong style={{ color: '#111827' }}>Database</strong>
      </div>
      
      <div style={{ fontSize: 12, color: '#374151', marginBottom: 4 }}>
        {data.label}
      </div>
      
      <div
        style={{
          display: 'inline-block',
          padding: '2px 6px',
          borderRadius: 4,
          background: color,
          color: '#ffffff',
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {dbType}
      </div>

      {data.query && (
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
            maxWidth: '100%',
          }}
        >
          {data.query}
        </div>
      )}

      {data.connection && (
        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
          📦 {data.connection}
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