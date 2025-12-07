// src/flow/store/useFlowStore.ts
import { create } from 'zustand'
import type { FlowNode, FlowEdge, ExecutionLogEntry, ValidationError } from '../types'

interface FlowState {
  // Core state
  nodes: FlowNode[]
  edges: FlowEdge[]
  selectedNodeId: string | null
  
  // Execution state
  isExecuting: boolean
  executionLog: ExecutionLogEntry[]
  
  // Validation state
  validationErrors: ValidationError[]
  
  // Actions - Node management
  setNodes: (nodes: FlowNode[]) => void
  addNode: (node: FlowNode) => void
  updateNode: (id: string, data: Partial<FlowNode['data']>) => void
  deleteNode: (id: string) => void
  
  // Actions - Edge management
  setEdges: (edges: FlowEdge[]) => void
  addEdge: (edge: FlowEdge) => void
  deleteEdge: (id: string) => void
  
  // Actions - Selection
  setSelectedNode: (id: string | null) => void
  
  // Actions - Execution
  executeFlow: () => Promise<void>
  stopExecution: () => void
  clearExecutionLog: () => void
  
  // Actions - Validation
  validateFlow: () => ValidationError[]
  
  // Actions - Import/Export
  exportFlow: () => string
  importFlow: (json: string) => void
  clearFlow: () => void
}

export const useFlowStore = create<FlowState>((set, get) => ({
      // Initial state
      nodes: [],
      edges: [],
      selectedNodeId: null,
      isExecuting: false,
      executionLog: [],
      validationErrors: [],

      // Node management
      setNodes: (nodes) => set({ nodes }),
      
      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
        })),

      updateNode: (id, data) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
        })),

      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter(
            (edge) => edge.source !== id && edge.target !== id
          ),
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        })),

      // Edge management
      setEdges: (edges) => set({ edges }),
      
      addEdge: (edge) =>
        set((state) => ({
          edges: [...state.edges, edge],
        })),

      deleteEdge: (id) =>
        set((state) => ({
          edges: state.edges.filter((edge) => edge.id !== id),
        })),

      // Selection
      setSelectedNode: (id) => set({ selectedNodeId: id }),

      // Execution
      executeFlow: async () => {
        const { nodes, edges } = get()
        
        set({ isExecuting: true, executionLog: [] })
        
        // Find start node
        const startNode = nodes.find((n) => n.type === 'start')
        if (!startNode) {
          set({
            executionLog: [
              {
                timestamp: Date.now(),
                nodeId: '',
                nodeName: 'System',
                status: 'error',
                message: 'No se encontró un nodo de inicio',
              },
            ],
            isExecuting: false,
          })
          return
        }

        // Execute flow
        await executeNode(startNode.id, nodes, edges, (entry) => {
          set((state) => ({
            executionLog: [...state.executionLog, entry],
          }))
        })

        set({ isExecuting: false })
      },

      stopExecution: () => set({ isExecuting: false }),
      
      clearExecutionLog: () => set({ executionLog: [] }),

      // Validation
      validateFlow: () => {
        const { nodes, edges } = get()
        const errors: ValidationError[] = []

        // Check for start node
        const startNodes = nodes.filter((n) => n.type === 'start')
        if (startNodes.length === 0) {
          errors.push({
            type: 'error',
            message: 'El flujo debe tener al menos un nodo de inicio',
          })
        }
        if (startNodes.length > 1) {
          errors.push({
            type: 'warning',
            message: 'El flujo tiene múltiples nodos de inicio',
          })
        }

        // Check for end node
        const endNodes = nodes.filter((n) => n.type === 'end')
        if (endNodes.length === 0) {
          errors.push({
            type: 'warning',
            message: 'El flujo no tiene nodos de finalización',
          })
        }

        // Check for disconnected nodes
        nodes.forEach((node) => {
          if (node.type === 'start') return
          
          const hasIncoming = edges.some((e) => e.target === node.id)
          if (!hasIncoming) {
            errors.push({
              nodeId: node.id,
              type: 'warning',
              message: `El nodo "${node.data.label}" no tiene conexiones entrantes`,
            })
          }
        })

        // Check for required fields
        nodes.forEach((node) => {
          if (node.type === 'api' && !node.data.url) {
            errors.push({
              nodeId: node.id,
              type: 'error',
              message: `El nodo API "${node.data.label}" requiere una URL`,
            })
          }
          if (node.type === 'database' && !node.data.query) {
            errors.push({
              nodeId: node.id,
              type: 'error',
              message: `El nodo Database "${node.data.label}" requiere una consulta`,
            })
          }
          if (node.type === 'condition' && !node.data.expression) {
            errors.push({
              nodeId: node.id,
              type: 'warning',
              message: `El nodo Condición "${node.data.label}" no tiene expresión definida`,
            })
          }
        })

        set({ validationErrors: errors })
        return errors
      },

      // Import/Export
      exportFlow: () => {
        const { nodes, edges } = get()
        return JSON.stringify({ nodes, edges }, null, 2)
      },

      importFlow: (json) => {
        try {
          const data = JSON.parse(json)
          set({
            nodes: data.nodes || [],
            edges: data.edges || [],
            selectedNodeId: null,
            executionLog: [],
            validationErrors: [],
          })
        } catch (error) {
          console.error('Error al importar flujo:', error)
        }
      },

      clearFlow: () =>
        set({
          nodes: [],
          edges: [],
          selectedNodeId: null,
          executionLog: [],
          validationErrors: [],
        }),
}))

// Helper function for execution
async function executeNode(
  nodeId: string,
  nodes: FlowNode[],
  edges: FlowEdge[],
  log: (entry: ExecutionLogEntry) => void
): Promise<void> {
  const node = nodes.find((n) => n.id === nodeId)
  if (!node) return

  // Log start
  log({
    timestamp: Date.now(),
    nodeId: node.id,
    nodeName: node.data.label,
    status: 'start',
    message: `Ejecutando ${node.type}`,
  })

  // Simulate execution delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

  // Simulate execution based on node type
  try {
    let nextNodeId: string | null = null

    switch (node.type) {
      case 'start':
        log({
          timestamp: Date.now(),
          nodeId: node.id,
          nodeName: node.data.label,
          status: 'success',
          message: 'Flujo iniciado',
        })
        break

      case 'action':
        log({
          timestamp: Date.now(),
          nodeId: node.id,
          nodeName: node.data.label,
          status: 'success',
          message: `Acción ejecutada: ${node.data.actionType || 'process'}`,
        })
        break

      case 'condition':
        const conditionResult = Math.random() > 0.5
        log({
          timestamp: Date.now(),
          nodeId: node.id,
          nodeName: node.data.label,
          status: 'success',
          message: `Condición evaluada: ${conditionResult ? 'true' : 'false'}`,
          data: { result: conditionResult },
        })
        break

      case 'api':
        log({
          timestamp: Date.now(),
          nodeId: node.id,
          nodeName: node.data.label,
          status: 'success',
          message: `API llamada: ${node.data.method} ${node.data.url}`,
          data: { status: 200, response: 'OK' },
        })
        break

      case 'database':
        log({
          timestamp: Date.now(),
          nodeId: node.id,
          nodeName: node.data.label,
          status: 'success',
          message: `Query ejecutada: ${node.data.dbType}`,
          data: { affected: 1 },
        })
        break

      case 'timer':
        const delay = node.data.delay || 1
        log({
          timestamp: Date.now(),
          nodeId: node.id,
          nodeName: node.data.label,
          status: 'success',
          message: `Esperando ${delay} ${node.data.unit || 'seconds'}`,
        })
        await new Promise((resolve) => setTimeout(resolve, delay * 1000))
        break

      case 'end':
        log({
          timestamp: Date.now(),
          nodeId: node.id,
          nodeName: node.data.label,
          status: 'success',
          message: 'Flujo finalizado',
        })
        return
    }

    // Find next node(s)
    const nextEdges = edges.filter((e) => e.source === nodeId)
    for (const edge of nextEdges) {
      await executeNode(edge.target, nodes, edges, log)
    }
  } catch (error) {
    log({
      timestamp: Date.now(),
      nodeId: node.id,
      nodeName: node.data.label,
      status: 'error',
      message: `Error: ${error}`,
    })
  }
}