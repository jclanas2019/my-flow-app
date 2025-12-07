// src/flow/nodeTypes/EndNode.tsx
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types'

export function EndNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div
      style={{
        padding: 14,
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        borderRadius: 12,
        border: selected ? '2px solid #f87171' : '2px solid #ef4444',
        boxShadow: selected
          ? '0 8px 24px rgba(239, 68, 68, 0.35)'
          : '0 2px 8px rgba(239, 68, 68, 0.2)',
        fontSize: 13,
        minWidth: 160,
        color: '#ffffff',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <rect x="9" y="9" width="6" height="6" fill="currentColor" />
        </svg>
        <strong style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Fin
        </strong>
      </div>
      <div style={{ fontSize: 12, opacity: 0.95 }}>{data.label}</div>
      {data.description && (
        <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>
          {data.description}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 12,
          height: 12,
          background: '#ffffff',
          border: '2px solid #ef4444',
        }}
      />
    </div>
  )
}