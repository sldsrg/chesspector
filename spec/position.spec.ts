import * as mocha from "mocha"
import * as chai from "chai"

import { newPiece, Position } from "../src"

const expect = chai.expect

describe("Piece", () => {
  it("constructed with code in upper case must be white piece", () => {
    const pce = newPiece("P", 0, 0)
    expect(pce.isWhite).to.equal(true)
  })
  it("constructed with code in lower case must be black piece", () => {
    const pce = newPiece("p", 0, 0)
    expect(pce.isWhite).to.equal(false)
  })
})

describe("Chessboard position", () => {
  it("must be invalid if white king missed", () => {
    const pos = new Position("4k3/8/8/8/8/8/8/8 w - -")
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.MISSING_WHITE_KING)
  })

  it("must be invalid if black king missed", () => {
    const pos = new Position("8/8/8/8/8/8/8/4K3 w - -")
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.MISSING_BLACK_KING)
  })

  it("must be invalid with many white kings", () => {
    const pos = new Position("4k3/8/8/8/8/8/8/3KK3 w - -")
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.TOO_MANY_WHITE_KINGS)
  })

  it("must be invalid with many black kings", () => {
    const pos = new Position("3kk3/8/8/8/8/8/8/4K3 w - -")
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.TOO_MANY_BLACK_KINGS)
  })

  it("must be invalid if white pieces count greater then 16", () => {
    const pos = new Position("4k3/8/8/8/8/7P/PPPPPPPP/RNBQKBNR w - -")
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.TOO_MANY_WHITE_PIECES)
  })

  it("must be invalid if black pieces count greater then 16", () => {
    const pos = new Position("rnbqkbnr/pppppppp/n7/8/8/8/8/4K3 w - -")
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.TOO_MANY_BLACK_PIECES)
  })

  it("must be invalid if any pawn on first rank", () => {
    const pos = new Position("4k3/8/8/8/8/8/8/P3K3 w - -")
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.PAWN_ON_FIRST_RANK)
  })

  it("must be invalid if any pawn on last rank", () => {
    const pos = new Position("p3k3/8/8/8/8/8/8/4K3 w - -")
    expect(pos.isValid()).to.equal(false)
    expect(pos.violations).to.contain(Position.NOTES.PAWN_ON_LAST_RANK)
  })

  it("detect 'blacks to move' flag", () => {
    const pos = new Position("r3k2r/8/8/8/8/8/8/R3K2R b QKqk -")
    expect(pos.whitesToMove).to.equal(false)
  })

  it("detect 'white king castling enabled' flags", () => {
    const pos = new Position("r3k2r/8/8/8/8/8/8/R3K2R w QK -")
    expect(pos.whiteCastlingLongEnabled).to.be.true
    expect(pos.whiteCastlingShortEnabled).to.be.true
  })

  it("detect 'black king castling enabled' flags", () => {
    const pos = new Position("r3k2r/8/8/8/8/8/8/R3K2R w qk -")
    expect(pos.blackCastlingLongEnabled).to.be.true
    expect(pos.blackCastlingShortEnabled).to.be.true
  })

  it("detect 'all castlings disabled' flags", () => {
    const pos = new Position("r3k2r/8/8/8/8/8/8/R3K2R w - -")
    expect(pos.whiteCastlingLongEnabled).to.equal(false)
    expect(pos.whiteCastlingShortEnabled).to.equal(false)
    expect(pos.blackCastlingLongEnabled).to.equal(false)
    expect(pos.blackCastlingShortEnabled).to.equal(false)
  })

  it("detect capture en-passant target", () => {
    let pos = new Position("8/3pp3/4Pp2/8/R4Ppk/8/8/3K4 b - f")
    expect(pos.captureEnpassantTarget).to.equal(5)

    pos = new Position("8/3pp3/4Pp2/8/R4Ppk/8/8/3K4 b - -")
    expect(pos.captureEnpassantTarget).to.equal(-1)
  })
})

describe("Initial chessboard position", () => {
  it("must be valid", () => {
    const pos = new Position(Position.INITIAL)
    expect(pos.isValid()).to.be.true
  })

  it("whites to move", () => {
    const pos = new Position(Position.INITIAL)
    expect(pos.whitesToMove).to.be.true
  })
})
