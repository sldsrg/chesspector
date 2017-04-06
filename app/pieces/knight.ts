import IPiece from './piece';
import Position from '../position';
import {MoveData, MoveFlags} from './movedata';

export default class Knight implements IPiece {

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
    return this.isWhite ? 'N' : 'n';
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData 
  {
    let istep = Math.abs(toRow - this._row);
    let jstep = Math.abs(toColumn - this._column);
    if (istep === 0 || jstep === 0 || istep + jstep !== 3) return null;

    let moveData = new MoveData(this._row, this._column, toRow, toColumn);
    let captured = pos.at[toRow][toColumn];
    if (captured !== null) {
      // can't capture own piece
      if (this.isWhite === captured.isWhite) return null;
        moveData.flags = MoveFlags.Capture,
        moveData.capturedPiece = captured;
    }
    return moveData;      
  }
}