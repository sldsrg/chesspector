import IPiece from "./piece";
import Position from "../position";
import Pawn from "./pawn";

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

  getLAN(pos: Position): string {
    let from = 
      String.fromCharCode(97 + this.fromColumn) + 
      String.fromCharCode(56 - this.fromRow);   
    let to = 
      String.fromCharCode(97 + this.toColumn) + 
      String.fromCharCode(56 - this.toRow);
    let piece = pos.at[this.fromRow][this.fromColumn];
    if (!piece) {
      throw "getLAN called for empty square";
    }
    else { 
      let code = piece.fenCode;
      if (/p/i.test(code)) {
        return `${from}-${to}`;
      }
      return `${code}${from}-${to}`;
    }
  }


}