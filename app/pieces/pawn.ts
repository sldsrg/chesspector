import {MoveData, MoveFlags, IPiece} from './piece';
import Position from '../position';

export default class Pawn implements IPiece {

  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'P' : 'p';
  }

  public getPseudoLegalMove(
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData 
  {
    let targetPiece = pos.position[toRow][toColumn];
    let drow = toRow - fromRow;
    let dcol = toColumn - fromColumn;
    let moveData = new MoveData(fromRow, fromColumn, toRow, toColumn);

    if (this.isWhite) {
      if (drow > 0) return null; // pawn moves only forfard
      if (dcol === 0) { // simple move
        if (fromRow === 6 && toRow === 4 ) { // long move from initial position
          if (pos.position[5][fromColumn] !== null) return null;
          if (targetPiece !== null) return null;
        }
        else if (drow < -1 || targetPiece !== null) return null;
      }
      else if (Math.abs(dcol) === 1) { // capture
        if (targetPiece === null) {
          if (pos.captureEnpassantTarget === toColumn) {
            moveData.flags = MoveFlags.CaptureEnPassant;
            moveData.capturedPiece = pos.position[4][toColumn];
          }
          else return null;
        }
        else if (!targetPiece.isWhite) {
          moveData.flags = MoveFlags.Capture;
          moveData.capturedPiece = targetPiece;
        }
        else return null;
      }
      else return null;      
    }
    else {
      if (drow < 0) return null; // pawn moves only forfard
      if (dcol === 0) { // simple move
        if (fromRow === 1 && toRow === 3 ) { // long move from initial position
          if (pos.position[2][fromColumn] !== null) return null;
          if (targetPiece !== null) return null;
        }
        else if (drow > 1 || targetPiece !== null) return null;

      }
      else if (Math.abs(dcol) === 1) { // capture
        if (targetPiece === null) {
          if (pos.captureEnpassantTarget === toColumn) {
            moveData.flags = MoveFlags.CaptureEnPassant;
          }
          else return null;
        }
        else if (targetPiece.isWhite) {
          moveData.flags = MoveFlags.Capture;
          moveData.capturedPiece = targetPiece;
        }
        else return null;
      }
      else return null;
    }

    return moveData;
  }
}