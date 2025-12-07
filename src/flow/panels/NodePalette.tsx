// src/flow/panels/NodePalette.tsx
import React from 'react'

interface NodeDefinition {
  type: string
  label: string
  tag: string
  icon: string
  category: string
}

const nodeDefinitions: NodeDefinition[] = [
  // Flow Control
  { type: 'start', label: 'Inicio', tag: 'Flow', icon: '▶️', category: 'control' },
  { type: 'end', label: 'Fin', tag: 'Flow', icon: '⏹️', category: 'control' },
  { type: 'condition', label: 'Condición', tag: 'Logic', icon: '💠', category: 'control' },
  { type: 'loop', label: 'Bucle', tag: 'Loop', icon: '🔄', category: 'control' },
  
  // Actions
  { type: 'action', label: 'Acción', tag: 'Step', icon: '⚡', category: 'action' },
  { type: 'timer', label: 'Timer', tag: 'Delay', icon: '⏱️', category: 'action' },
  
  // I/O
  { type: 'io', label: 'Entrada/Salida', tag: 'I/O', icon: '📝', category: 'io' },
  
  // Integration
  { type: 'api', label: 'API Call', tag: 'HTTP', icon: '🌐', category: 'integration' },
  { type: 'database', label: 'Database', tag: 'SQL', icon: '🗄️', category: 'integration' },
]

const categories = [
  { id: 'control', label: 'Control de Flujo', color: '#10b981' },
  { id: 'action', label: 'Acciones', color: '#3b82f6' },
  { id: 'io', label: 'Entrada/Salida', color: '#f59e0b' },
  { id: 'integration', label: 'Integraciones', color: '#8b5cf6' },
]

export function NodePalette() {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, type: string) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="sidebar-left">
      <div className="sidebar-left-header">
        <span className="sidebar-left-title">Componentes</span>
        <span className="sidebar-left-subtitle">
          Arrastra nodos al lienzo para construir tu flujo.
        </span>
      </div>

      {categories.map((category) => {
        const categoryNodes = nodeDefinitions.filter((n) => n.category === category.id)
        
        return (
          <div key={category.id} style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: category.color,
                marginBottom: 8,
                paddingLeft: 2,
              }}
            >
              {category.label}
            </div>
            
            {categoryNodes.map((node) => (
              <div
                key={node.type}
                draggable
                onDragStart={(e) => onDragStart(e, node.type)}
                className="node-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{node.icon}</span>
                  <span className="node-card-label">{node.label}</span>
                </div>
                <span className="node-card-tag">{node.tag}</span>
              </div>
            ))}
          </div>
        )
      })}

      <div
        style={{
          marginTop: 24,
          padding: 12,
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 8,
          fontSize: 11,
          color: '#075985',
        }}
      >
        <strong style={{ display: 'block', marginBottom: 4 }}>💡 Consejo</strong>
        <span>
          Conecta los nodos arrastrando desde los puntos de conexión para crear tu flujo de trabajo.
        </span>
      </div>
    </div>
  )
}