export default class Piece {
  fen_code: string;
  
  constructor(code) {
    this.fen_code = code;
  }

  get isWhite(): boolean {
    return /[RNBQKP]/.test(this.fen_code);
  }
}