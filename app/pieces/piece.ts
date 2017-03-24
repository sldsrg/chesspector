import Position from '../position';

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
}

export interface IPiece {
  isWhite: boolean; 
  fenCode: string;
  GetPseudoLegalMove(   
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData;
}