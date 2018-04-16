import { Position } from '../position'
import { MoveData } from '../movedata'

export interface IPiece {
  readonly isWhite: boolean
  readonly fenCode: string
  readonly row: number
  readonly column: number

  getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData
}
