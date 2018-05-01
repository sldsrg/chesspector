import { Position } from '../position'
import { MoveData } from '../movedata'

export class Piece {
  public readonly isWhite: boolean
  public readonly fenCode: string

  private _row: number
  private _column: number
  public get row(): number { return this._row }
  public get column(): number { return this._column }

  constructor(row: number, column: number, isWhite: boolean, fenCode: string) {
    this._row = row
    this._column = column
    this.isWhite = isWhite
    this.fenCode = fenCode
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData | undefined { return }

  public moveTo(
    pos: Position,
    toRow: number, toColumn: number): void {
      delete pos.at[this.row][this.column]
      pos.at[toRow][toColumn] = this
      this._row = toRow
      this._column = toColumn
    }
}
