import { MoveData, MoveFlags } from './movedata'
import { Position } from './position'

export enum Notation {
  ShortAlgebraic,
  LongAlgebraic,
  Castling,
}

// represent structure to organize hierarchical recordings of game or solution.
export class MoveRecord {
  private _numOfHalfmove: number
  private _notationType: Notation
  private _notationString: string
  private _next: MoveRecord
  private _previous: MoveRecord
  private _forks: MoveRecord[]

  constructor(
    num: number,
    move: string,
    public glyph?: number,
    public comment?: string) {
    this._numOfHalfmove = num
    this._notationString = move
    if (/^([rnbqk]?)([a-h])(\d)([-x])([a-h])(\d)(=[rnbq])?$/i.test(move)) {
      this._notationType = Notation.LongAlgebraic
    } else if (/^[0o]-[0o](-[0o])?$/i.test(move)) {
      this._notationType = Notation.Castling
    } else if (/^[rnbqk]?[a-h]?\d?x?[a-h]\d$/i.test(move)) {
      this._notationType = Notation.ShortAlgebraic
    } else {
      throw new Error('Invalid move notation')
    }
  }

  // Evaluate this object in given position context
  public eval(pos: Position): MoveData | undefined {
    if (this._notationType === Notation.LongAlgebraic) {
      const lan = this._notationString
      let pieceCode = ''
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
    } else if (this._notationType === Notation.ShortAlgebraic) {
      const exres = /^([rnbqk]?)([a-h])?(\d)?x?([a-h])(\d)$/i.exec(this._notationString)
      if (!exres) throw new Error(`Invalid move notation ${this._notationString}`)
      const res = exres!

      const pieceCode: string = res[1] ? res[1] : 'P'

      let fromColumn: number | undefined
      let fromRow: number | undefined
      let toColumn: number | undefined
      let toRow: number | undefined
      if (res[2]) fromColumn = res[2]!.charCodeAt(0) - 97
      if (res[3]) fromRow = 56 - res[3]!.charCodeAt(0)
      if (res[4]) toColumn = res[4]!.charCodeAt(0) - 97
      if (res[5]) toRow = 56 - res[5]!.charCodeAt(0)

      // TODO: must throw expection if target file undefined
      // TODO: must evaluate missing rank for shortened pawn capture notation

      const activePieces = pos.whitesToMove ? pos.whitePieces : pos.blackPieces
      // scan for first acceptable piece
      for (const piece of activePieces) {
        if (piece.fenCode !== pieceCode) continue
        if (fromColumn && piece.column !== fromColumn) continue
        if (fromRow && piece.row !== fromRow) continue
        const md = piece.getPseudoLegalMove(pos, toRow!, toColumn!)
        // return if piece can play considered move
        if (md) return md
      }
    } else if (this._notationType === Notation.Castling) {
      let toRow = 0 // defaults to black's row
      let toColumn = 2 // defaults to queen's side
      if (/^[0o]-[0o]$/i.test(this._notationString)) toColumn = 6

      let king = pos.blackPieces[0]
      if (pos.whitesToMove) {
        king = pos.whitePieces[0]
        toRow = 7
      }
      if (!king) throw new Error('King must be first in array of pieces')

      if (king!.row !== toRow || king!.column !== 4) return
      return king!.getPseudoLegalMove(pos, toRow, toColumn)
    }
    return
  }

  get next(): MoveRecord {
    return this._next
  }

  set next(value: MoveRecord) {
    this._next = value
  }

  get previous(): MoveRecord {
    return this._previous
  }

  set previous(value: MoveRecord) {
    this._previous = value
  }

  public fork(rec: MoveRecord) {
    if (this._forks) {
      this._forks.push(rec)
    } else {
      this._forks = [rec]
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
