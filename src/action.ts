export enum ActionType {
  Insert,
  Move,
  Delete
}

export interface IAction {
  type: ActionType,
  from?: {row: number, column: number},
  to?: {row: number, column: number},
  code?: string
}
