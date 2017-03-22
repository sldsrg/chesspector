export default class Piece {
  private fen_code: string;
  
  constructor(code) {
    this.fen_code = code;
  }

  get isWhite(): boolean {
    return /[RNBQKP]/.test(this.fen_code);
  }

  get fenCode(): string {
    return this.fen_code;
  }
}