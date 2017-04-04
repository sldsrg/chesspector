import IPiece from './piece';
import Position from '../position';
import {MoveData, MoveFlags} from './movedata';

export default class King implements IPiece {
  
  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'K' : 'k';
  }

  public getPseudoLegalMove(
    pos: Position,
    fromRow: number, fromColumn: number,
    toRow: number, toColumn: number): MoveData 
  {
    if (Math.abs(toRow - fromRow) > 1) return null;
    let moveData = new MoveData(fromRow, fromColumn, toRow, toColumn);
    if (Math.abs(toColumn - fromColumn) > 1) {
      // check castling ability
      if (this.isWhite) { 
        if (fromRow !== 7 || fromColumn !== 4 || toRow !== 7) return null;

        if (toColumn === 2 && pos.whiteCastlingLongEnabled) {
          if (pos.at[7][1] !== null) return null;
          if (pos.at[7][2] !== null) return null;
          if (pos.at[7][3] !== null) return null;
          moveData.flags = MoveFlags.CastlingLong;
          return moveData;
        } 
        else if (toColumn === 6 && pos.whiteCastlingShortEnabled){
          if (pos.at[7][5] !== null) return null;
          if (pos.at[7][6] !== null) return null;
          moveData.flags = MoveFlags.CastlingShort;
          return moveData;
        }    
      }
      else {
        if (fromRow !== 0 || fromColumn !== 4 || toRow !== 0) return null;

        if (toColumn === 2 && pos.blackCastlingLongEnabled) {
          if (pos.at[0][1] !== null) return null;
          if (pos.at[0][2] !== null) return null;
          if (pos.at[0][3] !== null) return null;
          moveData.flags = MoveFlags.CastlingLong;
          return moveData;
        } 
        else if (toColumn === 6 && pos.blackCastlingShortEnabled){
          if (pos.at[0][5] !== null) return null;
          if (pos.at[0][6] !== null) return null;
          moveData.flags = MoveFlags.CastlingShort;
          return moveData;
        }
      }
      return null;
    }
    else{
      let targetPiece = pos.at[toRow][toColumn];
      if (targetPiece === null) return moveData;
      else if (this.isWhite === targetPiece.isWhite) return null;
      moveData.flags = MoveFlags.Capture;
      moveData.capturedPiece = targetPiece;
      return moveData;
    }
  }
}