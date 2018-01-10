import { IPiece, Position, MoveData, MoveFlags } from ".."

export class Pawn implements IPiece {

  public readonly fenCode: string

  constructor(
    public readonly row: number,
    public readonly column: number,
    public readonly isWhite: boolean) {
    this.fenCode = this.isWhite ? "P" : "p"
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData {
    const targetPiece = pos.at[toRow][toColumn]
    const drow = toRow - this.row
    const dcol = toColumn - this.column
    const moveData = new MoveData(this.row, this.column, toRow, toColumn)

    if (this.isWhite) {
      if (drow > 0) return null // pawn moves only forfard
      if (dcol === 0) { // simple move
        if (this.row === 6 && toRow === 4 ) { // long move from initial position
          if (pos.at[5][this.column] !== null) return null
          if (targetPiece !== null) return null
        } else if (drow < -1 || targetPiece !== null) return null
      } else if (Math.abs(dcol) === 1) { // capture
        if (targetPiece === null) {
          if (pos.captureEnpassantTarget === toColumn) {
            moveData.flags = MoveFlags.CaptureEnPassant
            moveData.capturedPiece = pos.at[3][toColumn]
          } else return null
        } else if (!targetPiece.isWhite) {
          moveData.flags = MoveFlags.Capture
          moveData.capturedPiece = targetPiece
        } else return null
      } else return null
    } else {
      if (drow < 0) return null // pawn moves only forfard
      if (dcol === 0) { // simple move
        if (this.row === 1 && toRow === 3 ) { // long move from initial position
          if (pos.at[2][this.column] !== null) return null
          if (targetPiece !== null) return null
        } else if (drow > 1 || targetPiece !== null) return null

      } else if (Math.abs(dcol) === 1) { // capture
        if (targetPiece === null) {
          if (pos.captureEnpassantTarget === toColumn) {
            moveData.flags = MoveFlags.CaptureEnPassant
            moveData.capturedPiece = pos.at[4][toColumn]
          } else return null
        } else if (targetPiece.isWhite) {
          moveData.flags = MoveFlags.Capture
          moveData.capturedPiece = targetPiece
        } else return null
      } else return null
    }

    return moveData
  }
}
