export enum BlockType {
  EVENT = "event",
  ACTION = "action",
  CONTROL = "control",
}

export enum CategoryType {
  EVENTS = "events",
  MOVEMENT = "movement",
  LOGIC = "logic",
  CUSTOM = "custom",
}

export interface BlockParam {
  name: string
  type: "string" | "number" | "boolean"
  value: string | number | boolean
}

export interface Block {
  id?: string
  type: BlockType
  category: CategoryType
  label: string
  action: string
  params: BlockParam[]
}
