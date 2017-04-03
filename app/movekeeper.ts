import Move from "./move";
import { MoveData } from "./pieces/piece";
import Moveparser from "./moveparser";

export default class Movekeeper {
  private _moves: Move[];

  constructor(lan: string = null) {
    if (lan === null)
      this._moves = new Array<Move>();
    else
      this._moves = Moveparser.parseLAN(lan);
  }
  
  get hasMoves(): boolean {
    if (this._moves === null) return false;
    return this._moves.length > 0;
  }

  add(data: MoveData) {
    this._moves.push(null);
  }

  remove(move: Move) {
    this._moves.pop();
  }
}