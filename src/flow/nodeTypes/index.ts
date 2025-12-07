// src/flow/nodeTypes/index.ts
import { StartNode } from './StartNode'
import { EndNode } from './EndNode'
import { ActionNode } from './ActionNode'
import { ConditionNode } from './ConditionNode'
import { IoNode } from './IoNode'
import { ApiNode } from './ApiNode'
import { DatabaseNode } from './DatabaseNode'
import { TimerNode } from './TimerNode'
import { LoopNode } from './LoopNode'

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  condition: ConditionNode,
  io: IoNode,
  api: ApiNode,
  database: DatabaseNode,
  timer: TimerNode,
  loop: LoopNode,
}