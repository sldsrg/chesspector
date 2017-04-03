import { MoveData } from "./pieces/piece";

export default class MoveRecord {
  private _moveData: MoveData;
  private _pieceCode: string;

  constructor(
    pieceCode: string,
    data: MoveData, 
    num: number,
    text: string) 
  {
    this._moveData = data;  
    this._pieceCode = pieceCode;
  }

  get LAN(): string {
    let from = 
      String.fromCharCode(97 + this._moveData.fromColumn) + 
      String.fromCharCode(56 - this._moveData.fromRow);   
    let to = 
      String.fromCharCode(97 + this._moveData.toColumn) + 
      String.fromCharCode(56 - this._moveData.toRow);
    return `${this._pieceCode}${from}-${to}`;
  }

  static fromLAN(lan: string, num: number): MoveRecord {
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
    return new MoveRecord(pieceCode, md, num, '');
  }
}