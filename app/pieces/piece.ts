import Position from '../position';

export class MoveData {
}

export interface IPiece {
  isWhite: boolean; 
  fenCode: string;
  GetPseudoLegalMove(   
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData;
}