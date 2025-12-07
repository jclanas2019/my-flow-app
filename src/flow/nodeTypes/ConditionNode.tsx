// src/flow/nodeTypes/ConditionNode.tsx
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types'

export function ConditionNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <div
      style={{
        padding: 12,
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderRadius: 10,
        border: selected ? '2px solid #3b82f6' : '1px solid #bfdbfe',
        boxShadow: selected
          ? '0 6px 20px rgba(59, 130, 246, 0.25)'
          : '0 2px 6px rgba(59, 130, 246, 0.1)',
        fontSize: 12,
        minWidth: 180,
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
          <path d="M12 2L2 12L12 22L22 12L12 2Z" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <strong style={{ color: '#1e40af', fontSize: 11, textTransform: 'uppercase' }}>
          Condición
        </strong>
      </div>
      
      <div style={{ fontSize: 12, color: '#1e3a8a', marginBottom: 4, fontWeight: 500 }}>
        {data.label}
      </div>

      {data.description && (
        <div style={{ fontSize: 10, color: '#3b82f6', marginBottom: 6 }}>
          {data.description}
        </div>
      )}

      {data.expression && (
        <div
          style={{
            fontSize: 10,
            color: '#1e40af',
            fontFamily: 'monospace',
            background: 'rgba(255, 255, 255, 0.6)',
            padding: '4px 6px',
            borderRadius: 4,
            marginTop: 6,
            border: '1px solid #bfdbfe',
          }}
        >
          {data.expression}
        </div>
      )}

      {data.conditionType && (
        <div
          style={{
            marginTop: 6,
            padding: '2px 6px',
            borderRadius: 4,
            background: '#1e40af',
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 600,
            display: 'inline-block',
            textTransform: 'uppercase',
          }}
        >
          {data.conditionType}
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
        id="true"
        style={{ width: 10, height: 10, background: '#10b981', top: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ width: 10, height: 10, background: '#ef4444' }}
      />
      
      {/* Labels for outputs */}
      <div
        style={{
          position: 'absolute',
          right: -30,
          top: 'calc(30% - 8px)',
          fontSize: 9,
          color: '#10b981',
          fontWeight: 600,
        }}
      >
        TRUE
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 9,
          color: '#ef4444',
          fontWeight: 600,
        }}
      >
        FALSE
      </div>
    </div>
  )
}