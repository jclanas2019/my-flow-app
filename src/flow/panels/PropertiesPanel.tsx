// src/flow/panels/PropertiesPanel.tsx
import React from 'react'
import type { FlowNode } from '../types'
import { useFlowStore } from '../store/useFlowStore'

interface Props {
  selectedNode: FlowNode | null
}

export function PropertiesPanel({ selectedNode }: Props) {
  const updateNode = useFlowStore((state) => state.updateNode)

  if (!selectedNode) {
    return (
      <div className="sidebar-right">
        <div className="sidebar-right-header">Propiedades</div>
        <p className="sidebar-right-empty">Selecciona un nodo del flujo para ver y editar sus propiedades.</p>
      </div>
    )
  }

  const handleChange = (field: string, value: any) => {
    updateNode(selectedNode.id, { [field]: value })
  }

  return (
    <div className="sidebar-right">
      <div className="sidebar-right-header">
        Propiedades
        <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, opacity: 0.7 }}>
          {selectedNode.type?.toUpperCase()}
        </div>
      </div>

      {/* Common fields */}
      <div className="prop-group">
        <label className="prop-label">Etiqueta</label>
        <input
          className="prop-input"
          value={selectedNode.data.label ?? ''}
          onChange={(e) => handleChange('label', e.target.value)}
          placeholder="Nombre del nodo"
        />
      </div>

      <div className="prop-group">
        <label className="prop-label">Descripción</label>
        <textarea
          className="prop-input"
          value={selectedNode.data.description ?? ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descripción opcional"
          rows={2}
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      {/* Action node properties */}
      {selectedNode.type === 'action' && (
        <>
          <div className="prop-group">
            <label className="prop-label">Tipo de Acción</label>
            <select
              className="prop-input"
              value={selectedNode.data.actionType ?? 'process'}
              onChange={(e) => handleChange('actionType', e.target.value)}
            >
              <option value="transform">Transform</option>
              <option value="process">Process</option>
              <option value="validate">Validate</option>
            </select>
          </div>

          <div className="prop-group">
            <label className="prop-label">Script</label>
            <textarea
              className="prop-input"
              value={selectedNode.data.script ?? ''}
              onChange={(e) => handleChange('script', e.target.value)}
              placeholder="// Código JavaScript..."
              rows={4}
              style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 11 }}
            />
          </div>
        </>
      )}

      {/* Condition node properties */}
      {selectedNode.type === 'condition' && (
        <>
          <div className="prop-group">
            <label className="prop-label">Tipo de Condición</label>
            <select
              className="prop-input"
              value={selectedNode.data.conditionType ?? 'if'}
              onChange={(e) => handleChange('conditionType', e.target.value)}
            >
              <option value="if">If</option>
              <option value="switch">Switch</option>
            </select>
          </div>

          <div className="prop-group">
            <label className="prop-label">Expresión</label>
            <textarea
              className="prop-input"
              value={selectedNode.data.expression ?? ''}
              onChange={(e) => handleChange('expression', e.target.value)}
              placeholder="value > 10"
              rows={2}
              style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 11 }}
            />
          </div>
        </>
      )}

      {/* IO node properties */}
      {selectedNode.type === 'io' && (
        <>
          <div className="prop-group">
            <label className="prop-label">Tipo I/O</label>
            <select
              className="prop-input"
              value={selectedNode.data.ioType ?? 'input'}
              onChange={(e) => handleChange('ioType', e.target.value)}
            >
              <option value="input">Input</option>
              <option value="output">Output</option>
              <option value="log">Log</option>
            </select>
          </div>

          <div className="prop-group">
            <label className="prop-label">Formato</label>
            <select
              className="prop-input"
              value={selectedNode.data.format ?? 'json'}
              onChange={(e) => handleChange('format', e.target.value)}
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="text">Text</option>
            </select>
          </div>
        </>
      )}

      {/* API node properties */}
      {selectedNode.type === 'api' && (
        <>
          <div className="prop-group">
            <label className="prop-label">Método HTTP</label>
            <select
              className="prop-input"
              value={selectedNode.data.method ?? 'GET'}
              onChange={(e) => handleChange('method', e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="prop-group">
            <label className="prop-label">URL</label>
            <input
              className="prop-input"
              value={selectedNode.data.url ?? ''}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://api.example.com/endpoint"
              style={{ fontFamily: 'monospace', fontSize: 11 }}
            />
          </div>

          <div className="prop-group">
            <label className="prop-label">Headers (JSON)</label>
            <textarea
              className="prop-input"
              value={
                selectedNode.data.headers
                  ? JSON.stringify(selectedNode.data.headers, null, 2)
                  : ''
              }
              onChange={(e) => {
                try {
                  const headers = JSON.parse(e.target.value)
                  handleChange('headers', headers)
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              placeholder='{"Authorization": "Bearer token"}'
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 11 }}
            />
          </div>

          <div className="prop-group">
            <label className="prop-label">Body</label>
            <textarea
              className="prop-input"
              value={selectedNode.data.body ?? ''}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder='{"key": "value"}'
              rows={4}
              style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 11 }}
            />
          </div>
        </>
      )}

      {/* Database node properties */}
      {selectedNode.type === 'database' && (
        <>
          <div className="prop-group">
            <label className="prop-label">Tipo de Operación</label>
            <select
              className="prop-input"
              value={selectedNode.data.dbType ?? 'select'}
              onChange={(e) => handleChange('dbType', e.target.value)}
            >
              <option value="select">SELECT</option>
              <option value="insert">INSERT</option>
              <option value="update">UPDATE</option>
              <option value="delete">DELETE</option>
            </select>
          </div>

          <div className="prop-group">
            <label className="prop-label">Query SQL</label>
            <textarea
              className="prop-input"
              value={selectedNode.data.query ?? ''}
              onChange={(e) => handleChange('query', e.target.value)}
              placeholder="SELECT * FROM users WHERE id = ?"
              rows={4}
              style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 11 }}
            />
          </div>

          <div className="prop-group">
            <label className="prop-label">Conexión</label>
            <input
              className="prop-input"
              value={selectedNode.data.connection ?? ''}
              onChange={(e) => handleChange('connection', e.target.value)}
              placeholder="production-db"
            />
          </div>
        </>
      )}

      {/* Timer node properties */}
      {selectedNode.type === 'timer' && (
        <>
          <div className="prop-group">
            <label className="prop-label">Retraso</label>
            <input
              className="prop-input"
              type="number"
              value={selectedNode.data.delay ?? 1}
              onChange={(e) => handleChange('delay', parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>

          <div className="prop-group">
            <label className="prop-label">Unidad</label>
            <select
              className="prop-input"
              value={selectedNode.data.unit ?? 'seconds'}
              onChange={(e) => handleChange('unit', e.target.value)}
            >
              <option value="seconds">Segundos</option>
              <option value="minutes">Minutos</option>
              <option value="hours">Horas</option>
            </select>
          </div>
        </>
      )}

      {/* Loop node properties */}
      {selectedNode.type === 'loop' && (
        <>
          <div className="prop-group">
            <label className="prop-label">Tipo de Bucle</label>
            <select
              className="prop-input"
              value={selectedNode.data.loopType ?? 'for'}
              onChange={(e) => handleChange('loopType', e.target.value)}
            >
              <option value="for">For</option>
              <option value="while">While</option>
              <option value="foreach">ForEach</option>
            </select>
          </div>

          {selectedNode.data.loopType === 'for' && (
            <div className="prop-group">
              <label className="prop-label">Iteraciones</label>
              <input
                className="prop-input"
                type="number"
                value={selectedNode.data.iterations ?? 10}
                onChange={(e) => handleChange('iterations', parseInt(e.target.value) || 10)}
                min="1"
              />
            </div>
          )}

          {(selectedNode.data.loopType === 'while' ||
            selectedNode.data.loopType === 'foreach') && (
            <div className="prop-group">
              <label className="prop-label">Condición/Colección</label>
              <textarea
                className="prop-input"
                value={selectedNode.data.condition ?? ''}
                onChange={(e) => handleChange('condition', e.target.value)}
                placeholder={
                  selectedNode.data.loopType === 'while'
                    ? 'count < 100'
                    : 'items.forEach(...)'
                }
                rows={2}
                style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 11 }}
              />
            </div>
          )}
        </>
      )}

      {/* Node ID info */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #374151' }}>
        <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>Node ID</div>
        <div
          style={{
            fontSize: 11,
            color: '#9ca3af',
            fontFamily: 'monospace',
            background: '#0f172a',
            padding: '6px 8px',
            borderRadius: 6,
            wordBreak: 'break-all',
          }}
        >
          {selectedNode.id}
        </div>
      </div>
    </div>
  )
}