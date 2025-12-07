// src/flow/panels/Toolbar.tsx
import React, { useRef } from 'react'
import { useFlowStore } from '../store/useFlowStore'

export function Toolbar() {
  const {
    isExecuting,
    executeFlow,
    stopExecution,
    validateFlow,
    validationErrors,
    exportFlow,
    importFlow,
    clearFlow,
    clearExecutionLog,
  } = useFlowStore()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleValidate = () => {
    const errors = validateFlow()
    if (errors.length === 0) {
      alert('✅ Flujo válido - No se encontraron errores')
    } else {
      const errorCount = errors.filter((e) => e.type === 'error').length
      const warningCount = errors.filter((e) => e.type === 'warning').length
      alert(
        `⚠️ Validación completada:\n${errorCount} errores\n${warningCount} advertencias\n\nRevisa la consola para más detalles.`
      )
      console.log('Errores de validación:', errors)
    }
  }

  const handleExport = () => {
    const json = exportFlow()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workflow-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const json = event.target?.result as string
      importFlow(json)
    }
    reader.readAsText(file)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClear = () => {
    if (confirm('¿Estás seguro de que deseas limpiar todo el flujo?')) {
      clearFlow()
      clearExecutionLog()
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '8px 12px',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}
    >
      {/* Execution controls */}
      <div style={{ display: 'flex', gap: 4 }}>
        <ToolbarButton
          onClick={isExecuting ? stopExecution : executeFlow}
          disabled={false}
          variant={isExecuting ? 'danger' : 'primary'}
          title={isExecuting ? 'Detener ejecución' : 'Ejecutar flujo'}
        >
          {isExecuting ? '⏹️' : '▶️'}
        </ToolbarButton>

        <ToolbarButton
          onClick={handleValidate}
          variant="default"
          title="Validar flujo"
        >
          ✓
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      {/* File operations */}
      <div style={{ display: 'flex', gap: 4 }}>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Importar flujo">
          📁
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />

        <ToolbarButton onClick={handleExport} title="Exportar flujo">
          💾
        </ToolbarButton>

        <ToolbarButton onClick={handleClear} variant="danger" title="Limpiar flujo">
          🗑️
        </ToolbarButton>
      </div>

      {/* Validation errors indicator */}
      {validationErrors.length > 0 && (
        <>
          <ToolbarDivider />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 8px',
              background: validationErrors.some((e) => e.type === 'error')
                ? '#fee2e2'
                : '#fef3c7',
              borderRadius: 6,
              fontSize: 11,
              color: validationErrors.some((e) => e.type === 'error')
                ? '#991b1b'
                : '#92400e',
            }}
          >
            <span>{validationErrors.some((e) => e.type === 'error') ? '❌' : '⚠️'}</span>
            <span style={{ fontWeight: 500 }}>
              {validationErrors.filter((e) => e.type === 'error').length} errores,{' '}
              {validationErrors.filter((e) => e.type === 'warning').length} advertencias
            </span>
          </div>
        </>
      )}

      {/* Execution indicator */}
      {isExecuting && (
        <>
          <ToolbarDivider />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 8px',
              background: '#dbeafe',
              borderRadius: 6,
              fontSize: 11,
              color: '#1e40af',
            }}
          >
            <div className="spinner" />
            <span style={{ fontWeight: 500 }}>Ejecutando...</span>
          </div>
        </>
      )}
    </div>
  )
}

interface ToolbarButtonProps {
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'primary' | 'danger'
  title?: string
  children: React.ReactNode
}

function ToolbarButton({
  onClick,
  disabled = false,
  variant = 'default',
  title,
  children,
}: ToolbarButtonProps) {
  const variantStyles = {
    default: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      color: '#374151',
      hoverBg: '#f9fafb',
    },
    primary: {
      background: '#3b82f6',
      border: '1px solid #2563eb',
      color: '#ffffff',
      hoverBg: '#2563eb',
    },
    danger: {
      background: '#ef4444',
      border: '1px solid #dc2626',
      color: '#ffffff',
      hoverBg: '#dc2626',
    },
  }

  const styles = variantStyles[variant]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '6px 12px',
        background: disabled ? '#f3f4f6' : styles.background,
        border: styles.border,
        borderRadius: 8,
        color: disabled ? '#9ca3af' : styles.color,
        fontSize: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant !== 'default') {
          e.currentTarget.style.background = styles.hoverBg
        } else if (!disabled) {
          e.currentTarget.style.background = '#f9fafb'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = styles.background
        }
      }}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return (
    <div
      style={{
        width: 1,
        height: 24,
        background: '#e5e7eb',
        margin: '0 4px',
      }}
    />
  )
}