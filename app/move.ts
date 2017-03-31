import { MoveData } from "./pieces/piece";

export default class Move {
  private _moveData: MoveData;

  constructor(data: MoveData, num: number, text: string) {
    this._moveData = data;  
  }
}