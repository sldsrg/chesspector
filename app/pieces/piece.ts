import Position from '../position';
import { MoveData } from "./movedata";

interface IPiece {
  isWhite: boolean; 
  fenCode: string;

  getPseudoLegalMove(   
    pos: Position,
    toRow: number, toColumn: number): MoveData;
}

export default IPiece;