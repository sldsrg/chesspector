import { MoveData } from "./pieces/piece";

export default class Move {
  private _moveData: MoveData;

  constructor(data: MoveData, num: number, text: string) {
    this._moveData = data;  
  }

  static fromLAN(lan: string, num: number): Move {
    let md = new MoveData(1, 1, 1, 2);
    return new Move(md, num, '');
  }
}