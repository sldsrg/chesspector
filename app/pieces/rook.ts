import {MoveData, IPiece} from './piece';
import Position from '../position';


export default class Rook implements IPiece {

  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'R' : 'r';
  }

  public GetPseudoLegalMove(
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData 
  {
    return null;
  }
}