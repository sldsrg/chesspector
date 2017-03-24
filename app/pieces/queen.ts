import {MoveData, IPiece} from './piece';
import Position from '../position';

export default class Queen implements IPiece {

  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'Q' : 'q';
  }

  public GetPseudoLegalMove(
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData 
  {
    return null;
  }
}