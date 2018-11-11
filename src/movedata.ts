import { Piece } from './pieces/piece'
import { Position } from './position'
import { ActionType, IAction } from './action'
import { square } from './utils'

export enum MoveFlags {
  Quiet = 0,
  Capture = 1,
  CaptureEnPassant = 2,
  CastlingShort = 4,
  CastlingLong = 8,
  Castling = CastlingShort | CastlingLong,
  ShortCastlingLost = 16,
  LongCastlingLost = 32,
  PawnPromotion = 64,
}

export class MoveData {
  constructor(
    public from: {row: number, column: number},
    public to: {row: number, column: number},
    public flags: MoveFlags = MoveFlags.Quiet,
    public capturedPiece?: Piece,
    public promotedPieceCode?: string) {
    if (this.flags & (MoveFlags.Capture | MoveFlags.CaptureEnPassant) && !this.capturedPiece) {
      throw new Error('Captured piece undefined')
    }
  }

  public getLAN(pos: Position): string {
    const piece = pos.at[this.from.row][this.from.column]
    if (!piece) {
      throw new Error('getLAN called for empty square')
    } else {
      const code = piece.fenCode
      if (/p/i.test(code)) {
        return `${square(this.from)}-${square(this.to)}`
      }
      return `${code}${square(this.from)}-${square(this.to)}`
    }
  }

  public get actions(): IAction[] {
    const res = []
    res.push({
      type: ActionType.Move,
      from: {row: this.from.row, column: this.from.column},
      to: {row: this.to.row, column: this.to.column}
    })
    if (this.flags === MoveFlags.Quiet) return res
    if (this.flags === MoveFlags.Capture || this.flags === MoveFlags.CaptureEnPassant) {
      res.push({
        type: ActionType.Delete,
        from: this.capturedPiece!.square,
        code: this.capturedPiece!.isWhite ?
          this.capturedPiece!.fenCode.toUpperCase() :
          this.capturedPiece!.fenCode.toLowerCase()
      })
    } else if (this.flags === MoveFlags.CastlingShort) {
      res.push({
        type: ActionType.Move,
        from: {row: this.from.row, column: 7},
        to: {row: this.to.row, column: 5}
      })
    } else if (this.flags === MoveFlags.CastlingLong) {
      res.push({
        type: ActionType.Move,
        from: {row: this.from.row, column: 0},
        to: {row: this.to.row, column: 3}
      })
    } else if (this.flags === MoveFlags.PawnPromotion) {
      res.push({
        type: ActionType.Delete,
        from: {...this.to}
      })
      res.push({
        type: ActionType.Insert,
        to: {...this.to},
        code: this.promotedPieceCode
      })
    }
    return res
  }
}
