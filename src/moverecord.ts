import { MoveData, MoveFlags } from './movedata'
import { Position } from './position'

export enum Notation {
  ShortAlgebraic,
  LongAlgebraic,
  Castling,
}

// represent structure to organize hierarchical recordings of game or solution.
export class MoveRecord {
  private mNumOfHalfmove: number
  private mNotationType: Notation
  private mNotationString: string
  private mGlyph: number
  private mComment: string
  private mNext: MoveRecord
  private mPrevious: MoveRecord
  private mForks: MoveRecord[]

  constructor(
    num: number,
    move: string,
    glyph: number = 0,
    comment: string = null) {
    this.mNumOfHalfmove = num
    this.mNotationString = move
    if (/^([rnbqk]?)([a-h])(\d)([-x])([a-h])(\d)(=[rnbq])?$/i.test(move)) {
      this.mNotationType = Notation.LongAlgebraic
    } else if (/^[0o]-[0o](-[0o])?$/i.test(move)) {
      this.mNotationType = Notation.Castling
    } else if (/^[rnbqk]?[a-h]?\d?x?[a-h]\d$/i.test(move)) {
      this.mNotationType = Notation.ShortAlgebraic
    } else {
      throw new Error("Invalid move notation")
    }

    this.mGlyph = glyph
    this.mComment = comment
  }

  // Evaluate this object in given position context
  public eval(pos: Position): MoveData {
    if (this.mNotationType === Notation.LongAlgebraic) {
      const lan = this.mNotationString
      let pieceCode = ""
      let shft = 0
      if (/^[rnbqk]/i.test(lan)) {
        shft = 1
        pieceCode = lan[0]
      }
      const fromColumn = lan.charCodeAt(shft) - 97
      const fromRow = 56 - lan.charCodeAt(shft + 1)
      const toColumn = lan.charCodeAt(shft + 3) - 97
      const toRow = 56 - lan.charCodeAt(shft + 4)
      const md = new MoveData(fromRow, fromColumn, toRow, toColumn)
      return md
    } else if (this.mNotationType === Notation.ShortAlgebraic) {
      const res = /^([rnbqk]?)([a-h])?(\d)?x?([a-h])(\d)$/i.exec(this.mNotationString)

      let pieceCode = res[1]
      if (pieceCode === "") pieceCode = "P"

      let fromColumn
      if (res[2] !== undefined) fromColumn = res[2].charCodeAt(0) - 97

      let fromRow
      if (res[3] !== undefined) fromRow = 56 - res[3].charCodeAt(0)

      const toColumn = res[4].charCodeAt(0) - 97

      const toRow = 56 - res[5].charCodeAt(0)

      for (const piece of pos.whitePieces) {
        if (piece.fenCode !== pieceCode) continue
        if (fromColumn !== undefined && piece.column !== fromColumn) continue
        if (fromRow !== undefined && piece.row !== fromRow) continue
        const md = piece.getPseudoLegalMove(pos, toRow, toColumn)
        if (md !== null) return md
      }
    } else if (this.mNotationType === Notation.Castling) {
      let toRow = 0 // defaults to black's row
      let toColumn = 2 // defaults to queen's side
      if (/^[0o]-[0o]$/i.test(this.mNotationString)) toColumn = 6

      let king = pos.blackPieces[0]
      if (pos.whitesToMove) {
        king = pos.whitePieces[0]
        toRow = 7
      }
      if (king.row !== toRow || king.column !== 4) return null
      return king.getPseudoLegalMove(pos, toRow, toColumn)
    }
    return null
  }

  get comment(): string {
    return this.mComment
  }

  set comment(value: string) {
    this.mComment = value
  }

  get next(): MoveRecord {
    return this.mNext
  }

  set next(value: MoveRecord) {
    this.mNext = value
  }

  get previous(): MoveRecord {
    return this.mPrevious
  }

  set previous(value: MoveRecord) {
    this.mPrevious = value
  }

  public fork(rec: MoveRecord) {
    if (this.mForks) {
      this.mForks.push(rec)
    } else {
      this.mForks = [rec]
    }
  }

  // return number of half-moves from current to the end
  get length() {
    let len = 0
    let scan: MoveRecord = this
    while (scan) {
      len++
      scan = scan.next
    }
    return len
  }
}
