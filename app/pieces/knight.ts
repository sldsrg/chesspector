import { MoveData, IPiece, MoveFlags } from './piece';
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
    let istep = Math.abs(toRow - fromRow);
    let jstep = Math.abs(toColumn - fromColumn);
    if (istep == 0 || jstep == 0 || istep + jstep != 3) return null;

    let moveData = new MoveData(fromRow, fromColumn, toRow, toColumn);
    let captured = pos.position[toRow][toColumn];
    if (captured != null) {
      // can't capture own piece
      if (this.isWhite === captured.isWhite) return null;
        moveData.flags = MoveFlags.Capture,
        moveData.capturedPiece = captured;
    }
    return moveData;      
  }
}