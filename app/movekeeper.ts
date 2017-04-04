import MoveRecord from "./moverecord";
import { MoveData } from "./pieces/movedata";
import Moveparser from "./moveparser";

export default class Movekeeper {
  private _firstMove: MoveRecord;

  constructor(lan: string = null) {
    if (lan === null)
      this._firstMove = null;
    else
      this._firstMove = Moveparser.parseLAN(lan);
  }
  
  get hasMoves(): boolean {
    if (this._firstMove === null) return false;
    return true;
  }

  get first(): MoveRecord {
    return this._firstMove;
  }

  add(move: MoveRecord) {
    if (this.hasMoves) {
      let scan = this._firstMove;
      while (scan.next) {
        scan = scan.next;
      }
      scan.next = move;
    }
    else {
      this._firstMove = move;
    }   
  }

  remove(move: MoveRecord) {
    if (this.hasMoves) {
      if (this._firstMove === move) {
        this._firstMove = null;
      }
      else {  
        let scan = this._firstMove;
        while (scan !== move) {
          scan = scan.next;
        }
        scan = null;
      }
    }
  }

  // return number of half-moves on main thread
  get length() {
    let len = 0;
    let scan = this._firstMove;
    while (scan) {
      len++;
      scan = scan.next;
    }
    return len;
  }
}