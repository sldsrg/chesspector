import { Position } from '../position'
import { MoveData } from '../movedata'

export class Piece {
  public readonly isWhite: boolean
  public readonly fenCode: string

  private __row: number
  private __column: number
  public get row(): number { return this.__row }
  public get column(): number { return this.__column }

  constructor(row: number, column: number, isWhite: boolean, fenCode: string) {
    this.__row = row
    this.__column = column
    this.isWhite = isWhite
    this.fenCode = fenCode
  }

  getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData { return null }

  moveTo(
    pos: Position,
    toRow: number, toColumn: number) {
      pos.at[this.row][this.column] = null
      pos.at[toRow][toColumn] = this
      this.__row = toRow
      this.__column = toColumn
    }
}
