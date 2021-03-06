import { Piece } from './piece'
import { Position } from '../position'
import { MoveData, MoveFlags } from '../movedata'

export class Pawn extends Piece {
  constructor( row: number, column: number, isWhite: boolean) {
    super(row, column, isWhite, 'P')
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData | undefined {
    const targetPiece = pos.at[toRow][toColumn]
    const drow = toRow - this.square.row
    const dcol = toColumn - this.square.column
    const moveData = new MoveData(this.square, {row: toRow, column: toColumn})

    if (this.isWhite) {
      if (drow > 0) return // pawn moves only forfard
      if (dcol === 0) { // simple move
        if (this.square.row === 6 && toRow === 4 ) { // long move from initial position
          if (pos.at[5][this.square.column]) return
          if (targetPiece) return
        } else if (drow < -1 || targetPiece) return
      } else if (Math.abs(dcol) === 1) { // capture
        if (!targetPiece) {
          if (pos.captureEnpassantTarget === toColumn) {
            moveData.flags = MoveFlags.CaptureEnPassant
            moveData.capturedPiece = pos.at[3][toColumn]
          } else return
        } else if (!targetPiece.isWhite) {
          moveData.flags = MoveFlags.Capture
          moveData.capturedPiece = targetPiece
        } else return
      } else return
    } else {
      if (drow < 0) return // pawn moves only forfard
      if (dcol === 0) { // simple move
        if (this.square.row === 1 && toRow === 3 ) { // long move from initial position
          if (pos.at[2][this.square.column]) return
          if (targetPiece) return
        } else if (drow > 1 || targetPiece) return

      } else if (Math.abs(dcol) === 1) { // capture
        if (!targetPiece) {
          if (pos.captureEnpassantTarget === toColumn) {
            moveData.flags = MoveFlags.CaptureEnPassant
            moveData.capturedPiece = pos.at[4][toColumn]
          } else return
        } else if (targetPiece.isWhite) {
          moveData.flags = MoveFlags.Capture
          moveData.capturedPiece = targetPiece
        } else return
      } else return
    }

    return moveData
  }
}
