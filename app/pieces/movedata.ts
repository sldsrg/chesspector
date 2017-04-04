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
    if (!piece) 
      throw "getLAN called for empty square";
    else if (piece instanceof Pawn)
      return `${from}-${to}`;
    else
      return `${piece.fenCode}${from}-${to}`;
  }

  static fromLAN(lan: string,): MoveData {
    let pieceCode = '';
    let shft = 0;
    if (/^[rnbqk]/i.test(lan)) {
       shft = 1;
       pieceCode = lan[0];
    }
    let fromColumn = lan.charCodeAt(shft) - 97;
    let fromRow = 56 - lan.charCodeAt(shft + 1);  
    let toColumn = lan.charCodeAt(shft + 3) - 97;
    let toRow = 56 - lan.charCodeAt(shft + 4);
    let md = new MoveData(fromRow, fromColumn, toRow, toColumn);
    return md;
  }
}