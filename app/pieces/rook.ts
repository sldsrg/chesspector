import IPiece from './piece';
import Position from '../position';
import {MoveData, MoveFlags} from './movedata';

export default class Rook implements IPiece {

  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'R' : 'r';
  }

  public getPseudoLegalMove(
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData 
  {
    //keep vertical or horizontal
    if (fromColumn != toColumn && fromRow != toRow) return null;

    // check on obstacle
    let i_step = toRow - fromRow;
    if (i_step != 0) i_step = Math.sign(i_step);

    let j_step = toColumn - fromColumn;
    if (j_step != 0) j_step = Math.sign(j_step);

    let i = fromRow + i_step;
    let j = fromColumn + j_step;
    while (i != toRow || j != toColumn) {
      if (pos.at[i][j] !== null) return null;
      i += i_step;
      j += j_step;
    }

    let moveData = new MoveData(fromRow, fromColumn, toRow, toColumn);
    let capturedPiece = pos.at[toRow][toColumn];
    if (capturedPiece != null) {
        // can't capture own piece
        if (this.isWhite === capturedPiece.isWhite) return null;
        moveData.capturedPiece = capturedPiece;
        moveData.flags = MoveFlags.Capture;
    }
    return moveData;
  }
}