import {MoveData, IPiece} from './piece';
import Position from '../position';

export default class Pawn implements IPiece {

  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'P' : 'p';
  }

  public GetPseudoLegalMove(
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData 
  {
    let targetPiece = pos.position[toRow][toColumn];
    if (Math.abs(toColumn - fromColumn) === 1) { // looks like captue      
      if (targetPiece === null) {
        if (pos.captureEnpassantTarget === toColumn)
          return new MoveData();
        return null;
      }
    }
    if (fromRow === 6 && toRow === 4 && fromColumn === toColumn) {
      if (pos.position[5][fromColumn] !== null) return null;
    }
    return new MoveData();
  }
}