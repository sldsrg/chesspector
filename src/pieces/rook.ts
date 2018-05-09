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
    if (this.square.column !== toColumn && this.square.row !== toRow) return

    // check on obstacle
    let iStep = toRow - this.square.row
    if (iStep !== 0) iStep = Math.sign(iStep)

    let jStep = toColumn - this.square.column
    if (jStep !== 0) jStep = Math.sign(jStep)

    let i = this.square.row + iStep
    let j = this.square.column + jStep
    while (i !== toRow || j !== toColumn) {
      if (pos.at[i][j]) return
      i += iStep
      j += jStep
    }

    const moveData = new MoveData(this.square, {row: toRow, column: toColumn})
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
