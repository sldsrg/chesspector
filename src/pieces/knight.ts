import { Piece } from './piece'
import { Position } from '../position'
import { MoveData, MoveFlags } from '../movedata'

export class Knight extends Piece {
  constructor( row: number, column: number, isWhite: boolean) {
    super(row, column, isWhite, isWhite ? 'N' : 'n')
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData {
    const istep = Math.abs(toRow - this.row)
    const jstep = Math.abs(toColumn - this.column)
    if (istep === 0 || jstep === 0 || istep + jstep !== 3) return null

    const moveData = new MoveData(this.row, this.column, toRow, toColumn)
    const captured = pos.at[toRow][toColumn]
    if (captured !== null) {
      // can't capture own piece
      if (this.isWhite === captured.isWhite) return null
      moveData.flags = MoveFlags.Capture,
        moveData.capturedPiece = captured
    }
    return moveData
  }
}
