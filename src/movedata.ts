import { Piece } from './pieces/piece'
import { Position } from './position'
import { ActionType, IAction } from './action'

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
    const from =
      String.fromCharCode(97 + this.from.column) +
      String.fromCharCode(56 - this.from.row)
    const to =
      String.fromCharCode(97 + this.to.column) +
      String.fromCharCode(56 - this.to.row)
    const piece = pos.at[this.from.row][this.from.column]
    if (!piece) {
      throw new Error('getLAN called for empty square')
    } else {
      const code = piece.fenCode
      if (/p/i.test(code)) {
        return `${from}-${to}`
      }
      return `${code}${from}-${to}`
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
        code: this.capturedPiece!.fenCode
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
