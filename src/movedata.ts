import { IPiece } from './pieces/piece'
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
    public capturedPiece: IPiece = null,
    public promotedPieceCode: string = '\0') { }

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
    if (this.flags === MoveFlags.Quiet) {
      res.push({
        type: ActionType.Move,
        from: {row: this.fromRow, column: this.fromColumn},
        to: {row: this.toRow, column: this.toColumn}
      })
    }
    return res
  } 
}
