import Position from '../position';
import { MoveData } from "./movedata";

interface IPiece {
  isWhite: boolean; 
  fenCode: string;
  getPseudoLegalMove(   
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData;
}

export default IPiece;