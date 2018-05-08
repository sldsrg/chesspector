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
    public fromRow: number,
    public fromColumn: number,
    public toRow: number,
    public toColumn: number,
    public flags: MoveFlags = MoveFlags.Quiet,
    public capturedPiece?: Piece,
    public promotedPieceCode?: string) {
      if (this.flags & (MoveFlags.Capture | MoveFlags.CaptureEnPassant) && !this.capturedPiece) {
        throw new Error('Captured piece undefined')
      }
    }

  public getLAN(pos: Position): string {
    const from =
      String.fromCharCode(97 + this.fromColumn) +
      String.fromCharCode(56 - this.fromRow)
    const to =
      String.fromCharCode(97 + this.toColumn) +
      String.fromCharCode(56 - this.toRow)
    const piece = pos.at[this.fromRow][this.fromColumn]
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
    const res = new Array<IAction>()
    res.push({
      type: ActionType.Move,
      from: {row: this.fromRow, column: this.fromColumn},
      to: {row: this.toRow, column: this.toColumn}
    })
    if (this.flags === MoveFlags.Quiet) return res
    if (this.flags === MoveFlags.Capture || this.flags === MoveFlags.CaptureEnPassant) {
      res.push({
        type: ActionType.Delete,
        from: {row: this.capturedPiece!.row, column: this.capturedPiece!.column}
      })
    } else if (this.flags === MoveFlags.CastlingShort) {
      res.push({
        type: ActionType.Move,
        from: {row: this.fromRow, column: 7},
        to: {row: this.toRow, column: 5}
      })
    } else if (this.flags === MoveFlags.CastlingLong) {
      res.push({
        type: ActionType.Move,
        from: {row: this.fromRow, column: 0},
        to: {row: this.toRow, column: 3}
      })
    } else if (this.flags === MoveFlags.PawnPromotion) {
      res.push({
        type: ActionType.Delete,
        from: {row: this.toRow, column: this.toColumn}
      })
      res.push({
        type: ActionType.Insert,
        to: {row: this.toRow, column: this.toColumn},
        code: this.promotedPieceCode
      })
    }
    return res
  }
}
