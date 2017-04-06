import IPiece from './piece';
import Position from '../position';
import {MoveData, MoveFlags} from './movedata';

export default class Bishop implements IPiece {

  readonly fenCode: string;

  constructor(
    public readonly row: number,
    public readonly column: number,
    public readonly isWhite: boolean) 
  {
    this.fenCode = this.isWhite ? 'B' : 'b';
  }

  public getPseudoLegalMove(
    pos: Position,
    toRow: number, toColumn: number): MoveData 
  {
    // keep diagonal, vertical or horizontal
    if (Math.abs(this.column - toColumn) !== Math.abs(this.row - toRow)) return null;

    // check on obstacle
    let i_step = toRow - this.row;
    if (i_step !== 0) i_step = Math.sign(i_step);

    let j_step = toColumn - this.column;
    if (j_step !== 0) j_step = Math.sign(j_step);

    let i = this.row + i_step;
    let j = this.column + j_step;
    while (i !== toRow || j !== toColumn) {
      if (pos.at[i][j] !== null) return null;
      i += i_step;
      j += j_step;
    }

    let moveData = new MoveData(this.row, this.column, toRow, toColumn);
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