import MoveRecord from "./moverecord";

enum ParserState {
    none,       // пробел, табулятор, перенос строки или конец варианта
    num,        // номер хода
    period,     // точка
    periods,    // многоточие
    lan,        // длинная алгебраическая нотация хода
    san,        // короткая алгебраическая нотация хода
    nag,        // numegic annotation glyphs
    comment,    // комментарий
    terminator  // результат партии ["1-0"|"0-1"|"1/2-1/2"] ("*" определяется сразу)
}

export default class Moveparser {

  static parseLAN(lan: string): MoveRecord {
    let tempNum = 0;
    let tempNAG = 0;
    let tempLAN = '';
    let tempComment = '';
    let firstMove: MoveRecord = null;
    let tempMove: MoveRecord = null;
    let pieceCode = '';
    let whiteToMove = true;
    let state: ParserState;

    state = ParserState.none;
    
    for (let c of lan) {
      if ('\r' === c) c = ' '; // новую строку интерпретируем как разделитель
      else if ('\n' === c) c = ' ';
      switch (state) {
      case ParserState.none:
        if (/\d/.test(c)) {
          tempNum = Number.parseInt(c);
          state = ParserState.num;
        }
        else if (c === '.')
          state = ParserState.period;
        else if (c === '{') {
          tempComment = '';
          state = ParserState.comment;
        }
        else if (c == '$') {
          tempNAG = 0;
          state = ParserState.nag;
        }
        else if (/[PRNBQKabcdefghO0]/.test(c)) {
          tempLAN += c;
          pieceCode = 'P';
          if (/[PRNBQK]/.test(c)) pieceCode = c;
          state = ParserState.san;
          // TODO  0-0(-0) O-O(-O) => piece code = 'K' 
        }
        else if (/S/.test(c)) {
          throw "PGN file format error";
        }
        break;
      case ParserState.num:
          if (/\d/.test(c))
              tempNum = tempNum * 10 + Number.parseInt(c);
          else if (c === '.') {
              //_Current.Number = Convert.ToInt32(number);
              state = ParserState.period;
          }
          else if (/\w/.test(c)) {
              //_Current.Number = Convert.ToInt32(number);
              state = ParserState.none;
          }
          else if (c === '-' || c === '/') {
              //terminator = number + c.ToString();
              state = ParserState.terminator;
          }
          else
              throw "PGN file format error";
        break;
      case ParserState.period:
        if (c === '.')
          state = ParserState.periods;
        else {
          tempLAN += c;
          state = ParserState.lan;
          // некоторые программы игнорируют отделение номера хода пробелом (CA7)
        }
        break;
      case ParserState.periods:
        if (c === '.') {
          state = ParserState.none;
          whiteToMove = false;
        }
        else
          throw "PGN file format error";
        break;
      case ParserState.lan:      
      case ParserState.san:
        if (/[PRNBQKabcdefgh12345678-]/.test(c)) {
          tempLAN += c;
        }
        else if ( c === ' ' || c === ')') {
          if (tempMove) {
            tempMove.next = new MoveRecord(tempNum, tempLAN);
            tempMove = tempMove.next;
          }
          else {
            tempMove = new MoveRecord(tempNum, tempLAN);
          }

          if (firstMove === null) {
            firstMove = tempMove;
          }

          // redundant because number calculated from previous move
          //current.Number = tempNumber;

          //if (c == ')') return first;

          whiteToMove = !whiteToMove;
          state = ParserState.none;
        }
        else
          throw "PGN file format error";
        break;
      case ParserState.nag:
        if (/\d/.test(c))
          tempNAG = tempNAG * 10 + Number.parseInt(c);
        else if (/\w/.test(c)) {
          //current.NAG = tempNAG;
          state = ParserState.none;
        }
        else
          throw "PGN file format error";
        break;
      case ParserState.comment:
        if (c == '}') {
          //current.Annotation = sbComment.ToString();
          state = ParserState.none;
        }
        else
          //sbComment.Append(c.ToString());
        break;
      }
    }

    if (state === ParserState.lan || state === ParserState.san) {

      if (tempMove) {
        tempMove.next = new MoveRecord(tempNum, tempLAN);
        tempMove = tempMove.next;
      }
      else {
        tempMove = new MoveRecord(tempNum, tempLAN);
      }

      if (firstMove === null) {
        firstMove = tempMove;
      }
    }

    return firstMove;
  }
}