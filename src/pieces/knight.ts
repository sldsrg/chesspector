import { Piece } from './piece'
import { Position } from '../position'
import { MoveData, MoveFlags } from '../movedata'

export class Knight extends Piece {
  constructor( row: number, column: number, isWhite: boolean) {
    super(row, column, isWhite, isWhite ? 'N' : 'n')
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData | undefined {
    const istep = Math.abs(toRow - this.square.row)
    const jstep = Math.abs(toColumn - this.square.column)
    if (istep === 0 || jstep === 0 || istep + jstep !== 3) return

    const moveData = new MoveData(this.square, {row: toRow, column: toColumn})
    const captured = pos.at[toRow][toColumn]
    if (captured) {
      // can't capture own piece
      if (this.isWhite === captured.isWhite) return
      moveData.flags = MoveFlags.Capture,
        moveData.capturedPiece = captured
    }
    return moveData
  }
}
