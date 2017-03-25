import { MoveData, IPiece, MoveFlags } from './piece';
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
    // keep diagonal, vertical or horizontal
    if (Math.abs(fromColumn - toColumn) !== Math.abs(fromRow - toRow) &&
      fromColumn != toColumn && fromRow != toRow) return null;

    // check on obstacle
    let i_step = toRow - fromRow;
    if (i_step != 0) i_step = Math.sign(i_step);

    let j_step = toColumn - fromColumn;
    if (j_step != 0) j_step = Math.sign(j_step);

    let i = fromRow + i_step;
    let j = fromColumn + j_step;
    while (i != toRow || j != toColumn) {
      if (pos.position[i][j] !== null) return null;
      i += i_step;
      j += j_step;
    }

    let moveData = new MoveData(fromRow, fromColumn, toRow, toColumn);
    let capturedPiece = pos.position[toRow][toColumn];
    if (capturedPiece != null) {
        // can't capture own piece
        if (this.isWhite === capturedPiece.isWhite) return null;
        moveData.capturedPiece = capturedPiece;
        moveData.flags = MoveFlags.Capture;
    }
    return moveData;
  }
}