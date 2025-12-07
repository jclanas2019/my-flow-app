// src/flow/nodeTypes/TimerNode.tsx
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types'

export function TimerNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div
      style={{
        padding: 12,
        background: '#ffffff',
        borderRadius: 10,
        border: selected ? '2px solid #f59e0b' : '1px solid #e5e7eb',
        boxShadow: selected
          ? '0 6px 20px rgba(245, 158, 11, 0.25)'
          : '0 2px 6px rgba(15, 23, 42, 0.1)',
        fontSize: 12,
        minWidth: 160,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <strong style={{ color: '#111827' }}>Timer</strong>
      </div>
      
      <div style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>
        {data.label}
      </div>
      
      {data.delay !== undefined && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#fffbeb',
            padding: '6px 8px',
            borderRadius: 6,
            border: '1px solid #fde68a',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600, color: '#d97706' }}>
            {data.delay}
          </span>
          <span style={{ fontSize: 11, color: '#92400e' }}>
            {data.unit || 'seconds'}
          </span>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 10, height: 10, background: '#f59e0b' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 10, height: 10, background: '#f59e0b' }}
      />
    </div>
  )
}