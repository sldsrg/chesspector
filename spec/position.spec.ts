import 'mocha'
import { expect } from 'chai'

import { newPiece, Position } from '../src'

describe('Piece', () => {
  it('constructed with code in upper case must be white piece', () => {
    const pce = newPiece('P', 0, 0)
    expect(pce.isWhite).to.equal(true)
  })
  it('constructed with code in lower case must be black piece', () => {
    const pce = newPiece('p', 0, 0)
    expect(pce.isWhite).to.equal(false)
  })
})

describe('Chessboard position', () => {
  it('must be invalid if white king missed', () => {
    const pos = new Position('4k3/8/8/8/8/8/8/8 w - -')
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.MISSING_WHITE_KING)
  })

  it('must be invalid if black king missed', () => {
    const pos = new Position('8/8/8/8/8/8/8/4K3 w - -')
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.MISSING_BLACK_KING)
  })

  it('must be invalid with many white kings', () => {
    const pos = new Position('4k3/8/8/8/8/8/8/3KK3 w - -')
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.TOO_MANY_WHITE_KINGS)
  })

  it('must be invalid with many black kings', () => {
    const pos = new Position('3kk3/8/8/8/8/8/8/4K3 w - -')
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.TOO_MANY_BLACK_KINGS)
  })

  it('must be invalid if white pieces count greater then 16', () => {
    const pos = new Position('4k3/8/8/8/8/7P/PPPPPPPP/RNBQKBNR w - -')
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.TOO_MANY_WHITE_PIECES)
  })

  it('must be invalid if black pieces count greater then 16', () => {
    const pos = new Position('rnbqkbnr/pppppppp/n7/8/8/8/8/4K3 w - -')
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.TOO_MANY_BLACK_PIECES)
  })

  it('must be invalid if any pawn on first rank', () => {
    const pos = new Position('4k3/8/8/8/8/8/8/P3K3 w - -')
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.PAWN_ON_FIRST_RANK)
  })

  it('must be invalid if any pawn on last rank', () => {
    const pos = new Position('p3k3/8/8/8/8/8/8/4K3 w - -')
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.PAWN_ON_LAST_RANK)
  })

  it('detect "blacks to move" flag', () => {
    const pos = new Position('r3k2r/8/8/8/8/8/8/R3K2R b QKqk -')
    expect(pos.whitesToMove).to.equal(false)
  })

  it('detect "white king castling enabled" flags', () => {
    const pos = new Position('r3k2r/8/8/8/8/8/8/R3K2R w QK -')
    expect(pos.whiteCastlingLongEnabled).to.equal(true)
    expect(pos.whiteCastlingShortEnabled).to.equal(true)
  })

  it('detect "black king castling enabled" flags', () => {
    const pos = new Position('r3k2r/8/8/8/8/8/8/R3K2R w qk -')
    expect(pos.blackCastlingLongEnabled).to.equal(true)
    expect(pos.blackCastlingShortEnabled).to.equal(true)
  })

  it('detect "all castlings disabled" flags', () => {
    const pos = new Position('r3k2r/8/8/8/8/8/8/R3K2R w - -')
    expect(pos.whiteCastlingLongEnabled).to.equal(false)
    expect(pos.whiteCastlingShortEnabled).to.equal(false)
    expect(pos.blackCastlingLongEnabled).to.equal(false)
    expect(pos.blackCastlingShortEnabled).to.equal(false)
  })

  it('detect capture en-passant target', () => {
    let pos = new Position('8/3pp3/4Pp2/8/R4Ppk/8/8/3K4 b - f')
    expect(pos.captureEnpassantTarget).to.equal(5)

    pos = new Position('8/3pp3/4Pp2/8/R4Ppk/8/8/3K4 b - -')
    expect(pos.captureEnpassantTarget).to.equal(-1)
  })
})

describe('Position`s method', () => {
  let pos: Position
  beforeEach(() => {
    pos = new Position('8/3pp3/4Pp2/8/R4Ppk/8/8/3K4 b - f')
  })

  it('deletePiece should throw if no piece at specified row and column', () => {
    expect(() => pos.deletePiece({row: 0, column: 0})).throw('Piece not found at [0, 0]')
  })

  it('deletePiece should remove spcified white piece', () => {
    const before = pos.whitePieces.length
    pos.deletePiece({row: 4, column: 0})
    expect(pos.toString()).to.equal('8/3pp3/4Pp2/8/5Ppk/8/8/3K4 b - f')
    expect(pos.whitePieces).to.have.lengthOf(before - 1)
  })

  it('deletePiece should remove spcified black piece', () => {
    const before = pos.blackPieces.length
    pos.deletePiece({row: 1, column: 3})
    expect(pos.toString()).to.equal('8/4p3/4Pp2/8/R4Ppk/8/8/3K4 b - f')
    expect(pos.blackPieces).to.have.lengthOf(before - 1)
  })

  it('movePiece should throw if no piece foun at specified row and column', () => {
    expect(() => pos.movePiece({row: 0, column: 0}, {row: 1, column: 1}))
    .throw('Piece not found at [0, 0]')
  })

  it('movePiece to empty square should correct update position and moved piece', () => {
    pos.movePiece({row: 1, column: 3}, {row: 2, column: 3})
    expect(pos.toString()).to.be.equal('8/4p3/3pPp2/8/R4Ppk/8/8/3K4 b - f')
    expect(pos.at[2][3].square).to.be.deep.equal({row: 2, column: 3})
  })

  it('movePiece to occupied square should correct update position and pieces set', () => {
    const before = pos.whitePieces.length
    pos.movePiece({row: 1, column: 3}, {row: 2, column: 4})
    expect(pos.toString()).to.be.equal('8/4p3/4pp2/8/R4Ppk/8/8/3K4 b - f')
    expect(pos.whitePieces).to.have.lengthOf(before - 1)
  })
})

describe('Initial chessboard position', () => {
  let position: Position

  beforeEach(() => {
    position = new Position(Position.INITIAL)
  })

  it('must be valid', () => {
    expect(position.isValid()).to.equal(true)
  })

  it('whites to move', () => {
    expect(position.whitesToMove).to.equal(true)
  })

  it('"toString" method return correct FEN representation', () => {
    expect(position.toString()).to.equal(Position.INITIAL)
  })
})
