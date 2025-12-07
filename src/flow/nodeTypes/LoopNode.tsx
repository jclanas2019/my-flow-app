// src/flow/nodeTypes/LoopNode.tsx
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types'

export function LoopNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div
      style={{
        padding: 12,
        background: '#ffffff',
        borderRadius: 10,
        border: selected ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
        boxShadow: selected
          ? '0 6px 20px rgba(139, 92, 246, 0.25)'
          : '0 2px 6px rgba(15, 23, 42, 0.1)',
        fontSize: 12,
        minWidth: 170,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
          <path d="M21 2v6h-6" />
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M3 22v-6h6" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
        <strong style={{ color: '#111827' }}>Loop</strong>
      </div>
      
      <div style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>
        {data.label}
      </div>
      
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {data.loopType && (
          <div
            style={{
              padding: '2px 6px',
              borderRadius: 4,
              background: '#f3e8ff',
              color: '#6b21a8',
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {data.loopType}
          </div>
        )}
        
        {data.iterations !== undefined && data.loopType === 'for' && (
          <div
            style={{
              padding: '2px 6px',
              borderRadius: 4,
              background: '#ede9fe',
              color: '#5b21b6',
              fontSize: 10,
            }}
          >
            {data.iterations}x
          </div>
        )}
      </div>

      {data.condition && data.loopType !== 'for' && (
        <div
          style={{
            fontSize: 10,
            color: '#6b7280',
            fontFamily: 'monospace',
            background: '#f9fafb',
            padding: '4px 6px',
            borderRadius: 4,
            marginTop: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.condition}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 10, height: 10, background: '#8b5cf6' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="next"
        style={{ width: 10, height: 10, background: '#8b5cf6', top: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="loop"
        style={{ width: 10, height: 10, background: '#a78bfa' }}
      />
    </div>
  )
}