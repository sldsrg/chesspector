import {MoveData, IPiece} from './piece';
import Position from '../position';

export default class Knight implements IPiece {
 
  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'N' : 'n';
  }

  public getPseudoLegalMove(
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData 
  {
    return null;
  }
}