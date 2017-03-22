import Position from 'position';
import './pieces/piece';

export default class Inspector {
  constructor(private _pos: Position) {

  }

  get position(): IPiece[][] {
    return this._pos.position;
  }

  getMove(sqFrom: string, sqTo: string): boolean {
    let fromFile = sqFrom.charCodeAt(0) - 97;
    let fromRank = sqFrom.charCodeAt(1) - 48;
    let toFile = sqTo.charCodeAt(0) - 97;
    let toRank = sqTo.charCodeAt(1) - 48;
    let fromRow = 8 - fromRank;
    let fromCol = fromFile;
    let toRow = 8 - toRank;
    let toCol = toFile;
    let piece = this.position[fromRow][fromCol];
    if (piece === null) return null;
    if (piece.fenCode === 'P') {
      let targetPiece = this.position[toRow][toCol];
      if (Math.abs(toCol - fromCol) === 1) { // looks like captue      
        if (targetPiece === null) {
          if (this._pos.captureEnpassantTarget === toCol) return true;
          return null;
        }
      }
      if (fromRank === 2 && toRank === 4 && fromFile === toFile) {
        if (this.position[5][fromCol] !== null) return null;
      }
    }
    return true;
  }
}