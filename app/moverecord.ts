import { MoveData, MoveFlags } from "./pieces/movedata"
import Position from "./position"

export enum Notation {
  ShortAlgebraic,
  LongAlgebraic
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
    this._notationType = Notation.LongAlgebraic;
    this._notationString = move;
    this._glyph = glyph;
    this._comment = comment;
  }

  // Evaluate this object in given position context
  eval(pos: Position): MoveData {
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
