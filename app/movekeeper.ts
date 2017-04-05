import MoveRecord from "./moverecord";
import { MoveData } from "./pieces/movedata";
import MoveParser  from "./moveparser";

export default class Movekeeper {
  private _firstMove: MoveRecord;

  constructor(lan: string = null) {
    if (lan === null) {
      this._firstMove = null;
    }
    else {
      let parser = new MoveParser(lan);
      this._firstMove = parser.parse();
    }
  }
  
  get hasMoves(): boolean {
    return this._firstMove !== null;
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
}
