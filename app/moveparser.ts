import MoveRecord from "./moverecord";

enum ParserState {
    none,       // пробел, табулятор, перенос строки или конец варианта
    num,        // номер хода
    period,     // точка
    periods,    // многоточие
    move,       // move notation in SAN or LAN format
    nag,        // numegic annotation glyphs
    comment,    // комментарий
    terminator  // результат партии ["1-0"|"0-1"|"1/2-1/2"] ("*" определяется сразу)
}

export default class MoveParser {
  private _src: string;
  private _pos: number;

  constructor(src: string) {
    this._src = src;
    this._pos = 0;
  }

  // return position of last processed char
  parse(): MoveRecord {
    let tempNum = 0;
    let tempNAG = 0;
    let tempNotation = '';
    let tempComment = '';
    let tempMove: MoveRecord = null;
    let pieceCode = '';
    let whiteToMove = true;
    let state: ParserState;
    let firstMove: MoveRecord = null;
    state = ParserState.none;
    
    for (;this._pos < this._src.length; this._pos++) {
      let c = this._src[this._pos];
      if ('\r' === c) {
        c = ' '; // новую строку интерпретируем как разделитель
      }
      else if ('\n' === c) {
        c = ' ';
      }
      switch (state) {
      case ParserState.none:
        if (/\d/.test(c)) {
          tempNum = Number.parseInt(c);
          state = ParserState.num;
        }
        else if (c === '.') {
          state = ParserState.period;
        }
        else if (c === '{') {
          tempComment = '';
          state = ParserState.comment;
        }
        else if (c === '$') {
          tempNAG = 0;
          state = ParserState.nag;
        }
        else if (/[PRNBQKabcdefghO0]/.test(c)) {
          tempNotation = c;
          pieceCode = 'P';
          if (/[PRNBQK]/.test(c)) {
             pieceCode = c;
          }
          state = ParserState.move;
          // TODO  0-0(-0) O-O(-O) => piece code = 'K' 
        }
        else if (c === '(') {
          this._pos++;
          tempMove.fork(this.parse());
          state = ParserState.none;
        }
        else if (c === ')') {
          return firstMove;
        }
        else if (/S/.test(c)) {
          throw "PGN file format error";
        }
        break;
      case ParserState.num:
        if (/\d/.test(c)) {
            tempNum = tempNum * 10 + Number.parseInt(c);
        }
        else if (c === '.') {
          state = ParserState.period;
        }
        else if (/\w/.test(c)) {
          state = ParserState.none;
        }
        else if (c === '-' || c === '/') {
          //terminator = number + c.ToString();
          state = ParserState.terminator;
        }
        else {
          throw "PGN file format error";
        }
        break;
      case ParserState.period:
        if (c === '.') {
          state = ParserState.periods;
        }
        else {
          tempNotation = c;
          state = ParserState.move;
          // некоторые программы игнорируют отделение номера хода пробелом (CA7)
        }
        break;
      case ParserState.periods:
        if (c === '.') {
          state = ParserState.none;
          whiteToMove = false;
        }
        else {
          throw "PGN file format error";
        }
        break;
      case ParserState.move:
        if (/[PRNBQKabcdefgh12345678-]/.test(c)) {
          tempNotation += c;
        }
        else if ( c === ' ' || c === ')') {
          if (tempMove) {
            tempMove.next = new MoveRecord(tempNum, tempNotation);
            tempMove = tempMove.next;
          }
          else {
            tempMove = new MoveRecord(tempNum, tempNotation);
          }

          if (firstMove === null) {
            firstMove = tempMove;
          }

          // redundant because number calculated from previous move
          //current.Number = tempNumber;

          if (c === ')') {
            return firstMove;
          }

          whiteToMove = !whiteToMove;
          state = ParserState.none;
        }
        else {
          throw "PGN file format error";
        }
        break;
      case ParserState.nag:
        if (/\d/.test(c)) {
          tempNAG = tempNAG * 10 + Number.parseInt(c);
        }
        else if (/\w/.test(c)) {
          //current.NAG = tempNAG;
          state = ParserState.none;
        }
        else {
          throw "PGN file format error";
        }
        break;
      case ParserState.comment:
        if (c === '}') {
          tempMove.comment = tempComment;
          state = ParserState.none;
        }
        else {
          tempComment += c;
        }
        break;
      }
    }

    if (state === ParserState.move) {
      if (tempMove) {
        tempMove.next = new MoveRecord(tempNum, tempNotation);
        tempMove = tempMove.next;
      }
      else {
        tempMove = new MoveRecord(tempNum, tempNotation);
      }

      if (firstMove === null) {
        firstMove = tempMove;
      }
    }

    return firstMove;
  }
}