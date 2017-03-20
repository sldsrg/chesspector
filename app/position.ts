import Piece from './pieces/piece';

export default class Position {
  static readonly MISSING_WHITE_KING: number = 1;
  static readonly MISSING_BLACK_KING: number = 2;
  static readonly TOO_MANY_WHITE_PIECES: number = 3;
  static readonly TOO_MANY_BLACK_PIECES: number = 4;
  static readonly TOO_MANY_WHITE_KINGS = 5;
  static readonly TOO_MANY_BLACK_KINGS = 6;

  static readonly NOTES: { [id: number] : string } = {
    1: "Missing white King",
    2: "Missing black King",
    3: "Exceede black pieces count",
    4: "Exceede black pieces count",
    5: "Too many white king",
    6: "Too many black king"
  };

  static readonly INITIAL: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w QKqk -";

  private _position: Piece[][] = [[], [], [], [], [], [], [], []];
  private _whitePieces: Piece[]  = []; // White King first
  private _blackPieces: Piece[] = []; // Black King first

  private _whitesToMove: boolean;
  private _whiteCastlingLongEnabled: boolean;
  private _whiteCastlingShortEnabled: boolean;
  private _blackCastlingLongEnabled: boolean;
  private _blackCastlingShortEnabled: boolean;
  private _captureEnpassantTarget: number;

  private _violations: string[];

  constructor(fen: string) {
    this.parse(fen);
  }

  isValid(): boolean {
    return this._violations.length === 0;
  }

  get violations(): string[] {
    return this._violations;
  }

  get whitesToMove(): boolean {
    return this._whitesToMove;
  }

  get whiteCastlingLongEnabled(): boolean {
    return this._whiteCastlingLongEnabled;
  }

  get whiteCastlingShortEnabled(): boolean {
    return this._whiteCastlingShortEnabled;
  }

  get blackCastlingLongEnabled(): boolean {
    return this._blackCastlingLongEnabled;
  }

  get blackCastlingShortEnabled(): boolean {
    return this._blackCastlingShortEnabled;
  }

  get captureEnpassantTarget(): number {
    return this._captureEnpassantTarget;
  }

  clear() {
    this._violations = [];
    this._whitePieces = [];
    this._blackPieces = [];
  }

  parse (fen: string) {
    this.clear();
    this._whitesToMove = false;
    let l = fen.length;
    if (l === 0) {
      this._violations.push(Position.NOTES[Position.MISSING_WHITE_KING]);
      this._violations.push(Position.NOTES[Position.MISSING_BLACK_KING]);
      return;
    }
    let curRow = 0;
    let curCol = 0;
    let k;
    for (k = 0; k < l && curRow < 8 && curCol < 8; k++) {
      let ch = fen[k];
      if (ch === ' ') continue;
      if (/\d/.test(ch)) {
        curCol += Number.parseInt(ch);
      }
      else if (ch === '/') {
        if (curCol !== 0) { 
          console.log(`Invalid FEN at position ${k} (char ${ch}) row ${curRow}, col ${curCol}`);
          throw new Error("Invalid FEN");
        }
      }
      else {
        let piece = new Piece(ch);
        if (piece.isWhite) {
          if (piece.fen_code === "K") {
            if (this._whitePieces.length > 0 && this._whitePieces[0].fen_code === "K") {
              this._violations.push(Position.NOTES[Position.TOO_MANY_WHITE_KINGS]);
            }
            this._whitePieces.unshift(piece);
          }
          else {
            this._whitePieces.push(piece);
          }
        }
        else {
          if (piece.fen_code === "k") {
            if (this._blackPieces.length > 0 && this._blackPieces[0].fen_code === "k") {
              this._violations.push(Position.NOTES[Position.TOO_MANY_BLACK_KINGS]);
            }
            this._blackPieces.unshift(piece);
          }
          else {
            this._blackPieces.push(piece);
          }
        }
        this._position[curRow][curCol] = piece;
        curCol++;
      }
      if (curCol === 8) {
          curCol = 0;
          curRow++;
      }
    }

    if (this._whitePieces.length === 0 || this._whitePieces[0].fen_code !== "K") {
      this.violations.push(Position.NOTES[Position.MISSING_WHITE_KING]);
    }   
    if (this._blackPieces.length === 0 || this._blackPieces[0].fen_code !== "k") {
      this.violations.push(Position.NOTES[Position.MISSING_BLACK_KING]);
    }
    if (this._whitePieces.length > 16) {
      this._violations.push(Position.NOTES[Position.TOO_MANY_WHITE_PIECES]);
    }
    if (this._blackPieces.length > 16) {
      this._violations.push(Position.NOTES[Position.TOO_MANY_BLACK_PIECES]);
    }
    let parts = fen.slice(k).trim().split(' ');
    let castlingAbility = parts[1];
    let enpassantTarget = parts[2];

    if (parts.length > 0) {
        this._whitesToMove = (parts[0] == "w");
    }
    else this._whitesToMove = true;

    if (parts.length > 1) {
      this._whiteCastlingLongEnabled = parts[1].includes('Q');
      this._whiteCastlingShortEnabled = parts[1].includes('K');
      this._blackCastlingLongEnabled = parts[1].includes('q');
      this._blackCastlingShortEnabled = parts[1].includes('k');
    }

    if (parts.length > 2) {
      if (parts[2][0] === '-') {
        this._captureEnpassantTarget = -1;
      }
      else {
         this._captureEnpassantTarget = parts[2].toLowerCase().charCodeAt(0) - 97;
      }
    }

  }
}