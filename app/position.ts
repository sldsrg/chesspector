export default class Position {
  static readonly MISSING_WHITE_KING: number = 1;
  static readonly MISSING_BLACK_KING: number = 2;

  static readonly NOTES: { [id: number] : string } = {
    1: "Missing white King",
    2: "Missing black King"
  };

  constructor(fen: string) {

  }

  isValid(): boolean {
    return false;
  }

  violations(): string[] {
    let res: string[] = [];
    res.push( Position.NOTES[Position.MISSING_WHITE_KING] );
    return res;
  }




}