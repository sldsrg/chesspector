import { Position } from '../position'
import { MoveData } from '../movedata'

export class Piece {
  public readonly isWhite: boolean
  public readonly fenCode: string
  public square: {row: number, column: number}

  constructor(row: number, column: number, isWhite: boolean, fenCode: string) {
    this.square = {row, column}
    this.isWhite = isWhite
    this.fenCode = fenCode
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData | undefined { return }
}
