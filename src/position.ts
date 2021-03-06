import { Piece } from './pieces/piece'
import { newPiece } from './pieces/factory'
import { square } from './utils'

/** class represent chess pieces with its coordinates and
 *  ability to make special move, i.e castling and capture en-passant
 */
export class Position {

  public static readonly NOTES = {
    MISSING_WHITE_KING: 'Missing white King',
    MISSING_BLACK_KING: 'Missing black King',
    TOO_MANY_WHITE_PIECES: 'Too many white pieces',
    TOO_MANY_BLACK_PIECES: 'Too many black pieces',
    TOO_MANY_WHITE_KINGS: 'Too many white king',
    TOO_MANY_BLACK_KINGS: 'Too many black king',
    PAWN_ON_FIRST_RANK: 'Pawn on first rank illegal',
    PAWN_ON_LAST_RANK: 'Pawn on last rank illegal',
  }

  /** FEN representation of initial position */
  public static readonly INITIAL: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w QKqk -'

  private _rows: Piece[][] = [[], [], [], [], [], [], [], []]
  private _whitePieces: Piece[] = [] // White King first
  private _blackPieces: Piece[] = [] // Black King first

  private _whitesToMove: boolean
  private _captureEnpassantTarget: number

  private _violations: string[]

  /** construct Position from given FEN representation
   *  @param fen FEN representation
   */
  constructor(fen: string) {
    this.parse(fen)
  }

  public isValid(): boolean {
    return this._violations.length === 0
  }

  get violations(): string[] {
    return this._violations
  }

  get whitesToMove(): boolean {
    return this._whitesToMove
  }

  /**
   * Switch next turn to move
   */
  public nextTurnToMove() {
    this._whitesToMove = !this._whitesToMove
  }

  /**
   * deletePiece
   * @param from row zero based row index from top
   *             column zero based column index from left
   */
  public deletePiece(from: {row: number, column: number}) {
    const {row, column} = from
    const piece = this.at[row][column]
    if (!piece) throw Error(`Piece not found at ${square(from)}`)
    if (piece.isWhite) {
      this._whitePieces = this._whitePieces.filter((p: Piece) => p !== piece)
    } else {
      this._blackPieces = this._blackPieces.filter((p: Piece) => p !== piece)
    }
    delete this._rows[row][column]
  }

  /**
   * movePiece - technical move, w/o rules control.
   * Source and target squares specified as object with numeric properties
   * @row zero based row index from top
   * @column zero based column index from left
   * @param from specified source square
   * @param to specified target square
   */
  public movePiece(
    from: {row: number, column: number},
    to: {row: number, column: number}
  ) {
    const piece = this._rows[from.row][from.column]
    if (!piece) throw Error(`Piece not found at ${square(from)}`)
    const target = this._rows[to.row][to.column]
    if (target) {
      if (target.isWhite) {
        this._whitePieces = this._whitePieces.filter((p: Piece) => p !== target)
      } else {
        this._blackPieces = this._blackPieces.filter((p: Piece) => p !== target)
      }
    }
    piece.square = {...to}
    this._rows[to.row][to.column] = piece
    delete this._rows[from.row][from.column]
  }

  public get whiteCastlingLongEnabled(): boolean {
    return this._whiteCastlingLongEnabled
  }
  public set whiteCastlingLongEnabled(value: boolean) {
    this._whiteCastlingLongEnabled = value
  }
  private _whiteCastlingLongEnabled: boolean

  public get whiteCastlingShortEnabled(): boolean {
    return this._whiteCastlingShortEnabled
  }
  public set whiteCastlingShortEnabled(value: boolean) {
    this._whiteCastlingShortEnabled = value
  }
  private _whiteCastlingShortEnabled: boolean

  public get blackCastlingLongEnabled(): boolean {
    return this._blackCastlingLongEnabled
  }
  public set blackCastlingLongEnabled(value: boolean) {
    this._blackCastlingLongEnabled = value
  }
  private _blackCastlingLongEnabled: boolean

  public get blackCastlingShortEnabled(): boolean {
    return this._blackCastlingShortEnabled
  }
  public set blackCastlingShortEnabled(value: boolean) {
    this._blackCastlingShortEnabled = value
  }
  private _blackCastlingShortEnabled: boolean

  get captureEnpassantTarget(): number {
    return this._captureEnpassantTarget
  }

  get at(): Piece[][] {
    return this._rows
  }

  get whitePieces(): Piece[] {
    return this._whitePieces
  }

  get blackPieces(): Piece[] {
    return this._blackPieces
  }

  public clear() {
    // TODO: position
    this._violations = []
    this._whitePieces = []
    this._blackPieces = []
  }

  /** Set current position from given FEN representation
   *  @param fen - FEN representation
   */
  public parse(fen: string) {
    this.clear()
    this._whitesToMove = false
    const l = fen.length
    if (l === 0) {
      this._violations.push(Position.NOTES.MISSING_WHITE_KING)
      this._violations.push(Position.NOTES.MISSING_BLACK_KING)
      return
    }
    let curRow = 0
    let curCol = 0
    let k
    for (k = 0; k < l && curRow < 8 && curCol < 8; k++) {
      const ch = fen[k]
      if (ch === ' ') continue
      if (/\d/.test(ch)) {
        curCol += Number.parseInt(ch, 10)
      } else if (ch === '/') {
        if (curCol !== 0) {
          console.log(`Invalid FEN at position ${k} (char ${ch}) row ${curRow}, col ${curCol}`)
          throw new Error('Invalid FEN')
        }
      } else {
        const piece = newPiece(ch, curRow, curCol)
        if (piece.isWhite) {
          if (piece.fenCode === 'K') {
            if (this._whitePieces.length > 0 && this._whitePieces[0].fenCode === 'K') {
              this._violations.push(Position.NOTES.TOO_MANY_WHITE_KINGS)
            }
            this._whitePieces.unshift(piece)
          } else {
            this._whitePieces.push(piece)
          }
        } else {
          if (piece.fenCode === 'K') {
            if (this._blackPieces.length > 0 && this._blackPieces[0].fenCode === 'K') {
              this._violations.push(Position.NOTES.TOO_MANY_BLACK_KINGS)
            }
            this._blackPieces.unshift(piece)
          } else {
            this._blackPieces.push(piece)
          }
        }
        if (/P/i.test(piece.fenCode)) {
          if (curRow === 0) this._violations.push(Position.NOTES.PAWN_ON_LAST_RANK)
          if (curRow === 7) this._violations.push(Position.NOTES.PAWN_ON_FIRST_RANK)
        }

        this._rows[curRow][curCol] = piece
        curCol++
      }
      if (curCol === 8) {
          curCol = 0
          curRow++
      }
    }

    if (this._whitePieces.length === 0 || this._whitePieces[0].fenCode !== 'K') {
      this._violations.push(Position.NOTES.MISSING_WHITE_KING)
    }
    if (this._blackPieces.length === 0 || this._blackPieces[0].fenCode !== 'K') {
      this._violations.push(Position.NOTES.MISSING_BLACK_KING)
    }
    if (this._whitePieces.length > 16) {
      this._violations.push(Position.NOTES.TOO_MANY_WHITE_PIECES)
    }
    if (this._blackPieces.length > 16) {
      this._violations.push(Position.NOTES.TOO_MANY_BLACK_PIECES)
    }
    const parts = fen.slice(k).trim().split(' ')
    const castlingAbility = parts[1]
    const enpassantTarget = parts[2]

    if (parts.length > 0) {
        this._whitesToMove = (parts[0] === 'w')
    } else this._whitesToMove = true

    if (parts.length > 1) {
      this._whiteCastlingLongEnabled = parts[1].includes('Q')
      this._whiteCastlingShortEnabled = parts[1].includes('K')
      this._blackCastlingLongEnabled = parts[1].includes('q')
      this._blackCastlingShortEnabled = parts[1].includes('k')
    }

    if (parts.length > 2) {
      if (parts[2][0] === '-') {
        this._captureEnpassantTarget = -1
      } else {
         this._captureEnpassantTarget = parts[2].toLowerCase().charCodeAt(0) - 97
      }
    }
  }

  /**
   * toString
   */
  public toString(): string {
    const res: string[] = []

    for (let i = 0; i < 8; i++) {
      const r = this._rows[i]
      let n = 0 // number of contiguous empty squares
      for (let j = 0; j < 8; j++) {
        const c = r[j]
        if (c === undefined) n++
        else {
          if (n > 0) {
            res.push(n.toString())
            n = 0
          }
          res.push(c.isWhite ? c.fenCode.toUpperCase() : c.fenCode.toLowerCase())
        }
      }
      if (n > 0) res.push(n.toString())
      res.push('/')
    }
    res.pop() // remove last slash

    res.push(this._whitesToMove ? ' w ' : ' b ')

    if (
      this._whiteCastlingShortEnabled ||
      this._whiteCastlingLongEnabled ||
      this._blackCastlingShortEnabled ||
      this._blackCastlingLongEnabled
    ) {
      if (this._whiteCastlingLongEnabled) res.push('Q')
      if (this._whiteCastlingShortEnabled) res.push('K')
      if (this._blackCastlingLongEnabled) res.push('q')
      if (this._blackCastlingShortEnabled) res.push('k')
    } else res.push('-')
    res.push(' ')
    if (this._captureEnpassantTarget === -1) res.push('-')
    else res.push('abcdefgh'[this._captureEnpassantTarget])

    return res.join('')
  }
}
