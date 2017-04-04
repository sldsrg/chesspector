import { MoveData } from "./pieces/movedata";

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
}