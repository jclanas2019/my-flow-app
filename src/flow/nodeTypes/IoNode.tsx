// src/flow/nodeTypes/IoNode.tsx
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types'

export function IoNode({ data, selected }: NodeProps<NodeData>) {
  const ioTypeColors: Record<string, { bg: string; border: string; text: string }> = {
    input: { bg: '#fef3c7', border: '#fbbf24', text: '#92400e' },
    output: { bg: '#ddd6fe', border: '#a78bfa', text: '#5b21b6' },
    log: { bg: '#e0e7ff', border: '#818cf8', text: '#3730a3' },
  }

  const ioType = data.ioType || 'input'
  const colors = ioTypeColors[ioType]

  const formatIcons: Record<string, string> = {
    json: '{}',
    xml: '</>',
    text: 'T',
  }

  return (
    <div
      style={{
        padding: 12,
        background: colors.bg,
        borderRadius: 10,
        border: selected ? `2px solid ${colors.border}` : `1px solid ${colors.border}`,
        boxShadow: selected
          ? `0 6px 20px ${colors.border}44`
          : '0 2px 6px rgba(15, 23, 42, 0.1)',
        fontSize: 12,
        minWidth: 160,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2">
          {ioType === 'input' && (
            <>
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </>
          )}
          {ioType === 'output' && (
            <>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </>
          )}
          {ioType === 'log' && (
            <>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </>
          )}
        </svg>
        <strong style={{ color: colors.text, fontSize: 11, textTransform: 'uppercase' }}>
          {ioType === 'input' ? 'Entrada' : ioType === 'output' ? 'Salida' : 'Log'}
        </strong>
      </div>
      
      <div style={{ fontSize: 12, color: colors.text, marginBottom: 4, fontWeight: 500 }}>
        {data.label}
      </div>

      {data.description && (
        <div style={{ fontSize: 10, color: colors.text, opacity: 0.8, marginBottom: 6 }}>
          {data.description}
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {data.format && (
          <div
            style={{
              padding: '2px 6px',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.7)',
              color: colors.text,
              fontSize: 10,
              fontWeight: 600,
              fontFamily: 'monospace',
              border: `1px solid ${colors.border}`,
            }}
          >
            {formatIcons[data.format] || data.format.toUpperCase()}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        style={{ width: 10, height: 10, background: colors.border }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ width: 10, height: 10, background: colors.border }}
      />
    </div>
  )
}