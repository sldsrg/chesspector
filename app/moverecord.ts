import { MoveData, MoveFlags } from "./pieces/movedata"
import Position from "./position"

export enum Notation {
  ShortAlgebraic,
  LongAlgebraic,
  Castling
}

// represent structure to organize hierarchical recordings of game or solution.
export default class MoveRecord {
  private _numOfHalfmove: number; 
  private _notationType: Notation;
  private _notationString: string;
  private _glyph: number;
  private _comment: string;
  private _next: MoveRecord;
  private _previous: MoveRecord;
  private _forks: MoveRecord[];

  constructor(
    num: number,
    move: string,
    glyph: number = 0,
    comment: string = null) 
  {
    this._numOfHalfmove = num;  
    this._notationString = move;
    if (/^([rnbqk]?)([a-h])(\d)([-x])([a-h])(\d)(=[rnbq])?$/i.test(move)) {
      this._notationType = Notation.LongAlgebraic;
    }
    else if (/^[0o]-[0o](-[0o])?$/i.test(move)) {
      this._notationType = Notation.Castling;
    }
    else if (/^[rnbqk]?[a-h]?\d?x?[a-h]\d$/i.test(move)) {
      this._notationType = Notation.ShortAlgebraic;
    }
    else {
      throw new Error("Invalid move notation");
    }

    this._glyph = glyph;
    this._comment = comment;
  }

  // Evaluate this object in given position context
  eval(pos: Position): MoveData {
    if (this._notationType === Notation.LongAlgebraic) {
      let lan = this._notationString;
      let pieceCode = '';
      let shft = 0;
      if (/^[rnbqk]/i.test(lan)) {
        shft = 1;
        pieceCode = lan[0];
      }
      let fromColumn = lan.charCodeAt(shft) - 97;
      let fromRow = 56 - lan.charCodeAt(shft + 1);  
      let toColumn = lan.charCodeAt(shft + 3) - 97;
      let toRow = 56 - lan.charCodeAt(shft + 4);
      let md = new MoveData(fromRow, fromColumn, toRow, toColumn);
      return md;
    }
    else if (this._notationType === Notation.ShortAlgebraic) {
      let res = /^([rnbqk]?)([a-h])?(\d)?x?([a-h])(\d)$/i.exec(this._notationString);
      
      let pieceCode = res[1];
      if (pieceCode === '') pieceCode = 'P';

      let fromColumn;
      if (res[2] !== undefined) fromColumn = res[2].charCodeAt(0) - 97;

      let fromRow;
      if (res[3] !== undefined) fromRow = 56 - res[3].charCodeAt(0);

      let toColumn = res[4].charCodeAt(0) - 97;

      let toRow = 56 - res[5].charCodeAt(0);

      for(let piece of pos.whitePieces) {
        if (piece.fenCode !== pieceCode) continue;
        if (fromColumn !== undefined && piece.column !== fromColumn) continue;
        if (fromRow !== undefined && piece.row !== fromRow) continue;
        let md = piece.getPseudoLegalMove(pos, toRow, toColumn);
        if (md !== null) return md;
      }
    }
    else {
      return null;
    }
  }

  get comment(): string {
    return this._comment;
  }

  set comment(value: string) {
    this._comment = value;
  }

  get next(): MoveRecord {
    return this._next;
  }

  set next(value: MoveRecord) {
    this._next = value;
  }

  get previous(): MoveRecord {
    return this._previous;
  }

  set previous(value: MoveRecord) {
    this._previous = value;
  }

  fork(rec: MoveRecord) {
    if (this._forks) {
      this._forks.push(rec);
    }
    else {
      this._forks = [rec];
    }
  }

  // return number of half-moves from current to the end
  get length() {
    let len = 0;
    let scan: MoveRecord = this;
    while (scan) {
      len++;
      scan = scan.next;
    }
    return len;
  }
}
