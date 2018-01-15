import { IPiece, Position, MoveData, MoveFlags } from ".."

export class Rook implements IPiece {

  public readonly fenCode: string

  constructor(
    public readonly row: number,
    public readonly column: number,
    public readonly isWhite: boolean) {
    this.fenCode = this.isWhite ? "R" : "r"
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData {
    // keep vertical or horizontal
    if (this.column !== toColumn && this.row !== toRow) return null

    // check on obstacle
    let iStep = toRow - this.row
    if (iStep !== 0) iStep = Math.sign(iStep)

    let jStep = toColumn - this.column
    if (jStep !== 0) jStep = Math.sign(jStep)

    let i = this.row + iStep
    let j = this.column + jStep
    while (i !== toRow || j !== toColumn) {
      if (pos.at[i][j] !== null) return null
      i += iStep
      j += jStep
    }

    const moveData = new MoveData(this.row, this.column, toRow, toColumn)
    const capturedPiece = pos.at[toRow][toColumn]
    if (capturedPiece !== null) {
        // can't capture own piece
        if (this.isWhite === capturedPiece.isWhite) return null
        moveData.capturedPiece = capturedPiece
        moveData.flags = MoveFlags.Capture
    }
    return moveData
  }
}