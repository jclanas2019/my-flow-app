// src/flow/types/index.ts
import type { Node, Edge } from 'reactflow'

export type NodeType =
  | 'start'
  | 'end'
  | 'action'
  | 'condition'
  | 'io'
  | 'api'
  | 'database'
  | 'timer'
  | 'loop'

export interface NodeData {
  label: string
  description?: string
  
  // Action node
  actionType?: 'transform' | 'process' | 'validate'
  script?: string
  
  // Condition node
  conditionType?: 'if' | 'switch'
  expression?: string
  
  // IO node
  ioType?: 'input' | 'output' | 'log'
  format?: 'json' | 'xml' | 'text'
  
  // API node
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url?: string
  headers?: Record<string, string>
  body?: string
  
  // Database node
  dbType?: 'select' | 'insert' | 'update' | 'delete'
  query?: string
  connection?: string
  
  // Timer node
  delay?: number
  unit?: 'seconds' | 'minutes' | 'hours'
  
  // Loop node
  loopType?: 'for' | 'while' | 'foreach'
  iterations?: number
  condition?: string
  
  // Execution state
  status?: 'idle' | 'running' | 'completed' | 'error'
  result?: any
  error?: string
}

export interface FlowNode extends Node {
  data: NodeData
}

export interface FlowEdge extends Edge {}

export interface FlowState {
  nodes: FlowNode[]
  edges: FlowEdge[]
  selectedNodeId: string | null
  isExecuting: boolean
  executionLog: ExecutionLogEntry[]
}

export interface ExecutionLogEntry {
  timestamp: number
  nodeId: string
  nodeName: string
  status: 'start' | 'success' | 'error'
  message: string
  data?: any
}

export interface ValidationError {
  nodeId?: string
  edgeId?: string
  type: 'error' | 'warning'
  message: string
}