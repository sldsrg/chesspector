import Position from 'position';
import { MoveData } from './pieces/movedata';
import IPiece from './pieces/piece';

export default class Inspector {
  constructor(private _pos: Position) {

  }

  getMove(sqFrom: string, sqTo: string): MoveData {
    let fromFile = sqFrom.charCodeAt(0) - 97;
    let fromRank = sqFrom.charCodeAt(1) - 48;
    let toFile = sqTo.charCodeAt(0) - 97;
    let toRank = sqTo.charCodeAt(1) - 48;
    let fromRow = 8 - fromRank;
    let fromCol = fromFile;
    let toRow = 8 - toRank;
    let toCol = toFile;
    let piece = this._pos.at[fromRow][fromCol];
    if (piece === null) return null;
    return piece.getPseudoLegalMove(this._pos, fromRow, fromCol, toRow, toCol);
  }
}