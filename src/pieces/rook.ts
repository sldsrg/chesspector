import { Piece } from './piece'
import { Position } from '../position'
import { MoveData, MoveFlags } from '../movedata'

export class Rook extends Piece {
  constructor( row: number, column: number, isWhite: boolean) {
    super(row, column, isWhite, isWhite ? 'R' : 'r')
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData | undefined {
    // keep vertical or horizontal
    if (this.column !== toColumn && this.row !== toRow) return

    // check on obstacle
    let iStep = toRow - this.row
    if (iStep !== 0) iStep = Math.sign(iStep)

    let jStep = toColumn - this.column
    if (jStep !== 0) jStep = Math.sign(jStep)

    let i = this.row + iStep
    let j = this.column + jStep
    while (i !== toRow || j !== toColumn) {
      if (pos.at[i][j]) return
      i += iStep
      j += jStep
    }

    const moveData = new MoveData(this.row, this.column, toRow, toColumn)
    const capturedPiece = pos.at[toRow][toColumn]
    if (capturedPiece) {
        // can't capture own piece
        if (this.isWhite === capturedPiece.isWhite) return
        moveData.capturedPiece = capturedPiece
        moveData.flags = MoveFlags.Capture
    }
    return moveData
  }
}
