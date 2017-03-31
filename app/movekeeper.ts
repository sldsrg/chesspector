import Move from "./move";
import { MoveData } from "./pieces/piece";

export default class Movekeeper {
  private _moves: Move[];
  constructor() {
    this._moves = new Array<Move>();

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