import { Piece } from './pieces/piece'
import { MoveData } from './movedata'
import { Position } from './position'

export class Inspector {
  constructor(private position: Position) {
  }

  public getMove(sqFrom: string, sqTo: string): MoveData {
    const fromFile = sqFrom.charCodeAt(0) - 97
    const fromRank = sqFrom.charCodeAt(1) - 48
    const toFile = sqTo.charCodeAt(0) - 97
    const toRank = sqTo.charCodeAt(1) - 48
    const fromRow = 8 - fromRank
    const fromCol = fromFile
    const toRow = 8 - toRank
    const toCol = toFile
    const piece = this.position.at[fromRow][fromCol]
    return piece === null ? null : piece.getPseudoLegalMove(this.position, toRow, toCol)
  }
}
