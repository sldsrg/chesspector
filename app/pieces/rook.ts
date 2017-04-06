import IPiece from './piece';
import Position from '../position';
import {MoveData, MoveFlags} from './movedata';

export default class Rook implements IPiece {
  
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
    return this.isWhite ? 'R' : 'r';
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData 
  {
    //keep vertical or horizontal
    if (this._column !== toColumn && this._row !== toRow) return null;

    // check on obstacle
    let i_step = toRow - this._row;
    if (i_step !== 0) i_step = Math.sign(i_step);

    let j_step = toColumn - this._column;
    if (j_step !== 0) j_step = Math.sign(j_step);

    let i = this._row + i_step;
    let j = this._column + j_step;
    while (i !== toRow || j !== toColumn) {
      if (pos.at[i][j] !== null) return null;
      i += i_step;
      j += j_step;
    }

    let moveData = new MoveData(this._row, this._column, toRow, toColumn);
    let capturedPiece = pos.at[toRow][toColumn];
    if (capturedPiece !== null) {
        // can't capture own piece
        if (this.isWhite === capturedPiece.isWhite) return null;
        moveData.capturedPiece = capturedPiece;
        moveData.flags = MoveFlags.Capture;
    }
    return moveData;
  }
}