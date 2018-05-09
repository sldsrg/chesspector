import { Piece } from './piece'
import { Position } from '../position'
import { MoveData, MoveFlags } from '../movedata'

export class King extends Piece {
  constructor( row: number, column: number, isWhite: boolean) {
    super(row, column, isWhite, isWhite ? 'K' : 'k')
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData | undefined {
    if (Math.abs(toRow - this.square.row) > 1) return
    const moveData = new MoveData(this.square, {row: toRow, column: toColumn})
    if (Math.abs(toColumn - this.square.column) > 1) {
      // check castling ability
      if (this.isWhite) {
        if (this.square.row !== 7 || this.square.column !== 4 || toRow !== 7) return

        if (toColumn === 2 && pos.whiteCastlingLongEnabled) {
          if (pos.at[7][1] || pos.at[7][2] || pos.at[7][3]) return
          moveData.flags = MoveFlags.CastlingLong
          return moveData
        } else if (toColumn === 6 && pos.whiteCastlingShortEnabled) {
          if (pos.at[7][5] || pos.at[7][6]) return
          moveData.flags = MoveFlags.CastlingShort
          return moveData
        }
      } else {
        if (this.square.row !== 0 || this.square.column !== 4 || toRow !== 0) return

        if (toColumn === 2 && pos.blackCastlingLongEnabled) {
          if (pos.at[0][1] || pos.at[0][2] || pos.at[0][3]) return
          moveData.flags = MoveFlags.CastlingLong
          return moveData
        } else if (toColumn === 6 && pos.blackCastlingShortEnabled) {
          if (pos.at[0][5] || pos.at[0][6]) return
          moveData.flags = MoveFlags.CastlingShort
          return moveData
        }
      }
      return
    } else {
      const targetPiece = pos.at[toRow][toColumn]
      if (!targetPiece) return moveData
      else if (this.isWhite === targetPiece.isWhite) return
      moveData.flags = MoveFlags.Capture
      moveData.capturedPiece = targetPiece
      return moveData
    }
  }
}
