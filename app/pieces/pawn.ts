import IPiece from './piece';
import Position from '../position';
import {MoveData, MoveFlags} from './movedata';

export default class Pawn implements IPiece {
  
  private _row: number;
  private _column: number;

  constructor(
    row: number,
    column: number,
    public readonly isWhite: boolean) 
  {
    this._row = row;
    this._column = column;
  }

  get fenCode(): string {
    return this.isWhite ? 'P' : 'p';
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData 
  {
    let targetPiece = pos.at[toRow][toColumn];
    let drow = toRow - this._row;
    let dcol = toColumn - this._column;
    let moveData = new MoveData(this._row, this._column, toRow, toColumn);

    if (this.isWhite) {
      if (drow > 0) return null; // pawn moves only forfard
      if (dcol === 0) { // simple move
        if (this._row === 6 && toRow === 4 ) { // long move from initial position
          if (pos.at[5][this._column] !== null) return null;
          if (targetPiece !== null) return null;
        }
        else if (drow < -1 || targetPiece !== null) return null;
      }
      else if (Math.abs(dcol) === 1) { // capture
        if (targetPiece === null) {
          if (pos.captureEnpassantTarget === toColumn) {
            moveData.flags = MoveFlags.CaptureEnPassant;
            moveData.capturedPiece = pos.at[3][toColumn];
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
        if (this._row === 1 && toRow === 3 ) { // long move from initial position
          if (pos.at[2][this._column] !== null) return null;
          if (targetPiece !== null) return null;
        }
        else if (drow > 1 || targetPiece !== null) return null;

      }
      else if (Math.abs(dcol) === 1) { // capture
        if (targetPiece === null) {
          if (pos.captureEnpassantTarget === toColumn) {
            moveData.flags = MoveFlags.CaptureEnPassant;
            moveData.capturedPiece = pos.at[4][toColumn];
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