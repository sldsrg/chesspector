import * as mocha from "mocha"
import * as chai from "chai"

import MoveRecord from "../src/moverecord"
import { MoveFlags } from "../src/pieces/movedata"
import Position from "../src/position"

const expect = chai.expect

describe(`MoveRecord`, () => {
  describe(`when constructed with LAN`, () => {
    describe(`and evaluated in positional context`, () => {
      let position: Position

      before(() => {
        position = new Position("4k2r/4p3/R7/2B3B1/8/8/4P3/R3K1N1 w Qk -")
      })

      it(`return valid MoveData object for pawn move`, () => {
        const rec = new MoveRecord(1, "e2-e4")
        const data = rec.eval(position)
        expect(data).to.exist
        expect(data.flags).to.equal(MoveFlags.Quiet)
        expect(data.fromRow).to.equal(6)
        expect(data.toRow).to.equal(4)
        expect(data.fromColumn).to.equal(4)
        expect(data.toColumn).to.equal(4)
        expect(data.capturedPiece).to.equal(null)
      })

      it(`return valid MoveData object for knight move`, () => {
        const rec = new MoveRecord(1, "Ng1-f3")
        const data = rec.eval(position)
        expect(data).to.exist
        expect(data.flags).to.equal(MoveFlags.Quiet)
        expect(data.fromRow).to.equal(7)
        expect(data.toRow).to.equal(5)
        expect(data.fromColumn).to.equal(6)
        expect(data.toColumn).to.equal(5)
        expect(data.capturedPiece).to.equal(null)
      })

      it(`return valid MoveData object for long castling`, () => {
        const rec = new MoveRecord(1, "O-O-O")
        const data = rec.eval(position)
        expect(data).to.exist
        expect(data.flags).to.equal(MoveFlags.CastlingLong)
        expect(data.fromRow).to.equal(7)
        expect(data.toRow).to.equal(7)
        expect(data.fromColumn).to.equal(4)
        expect(data.toColumn).to.equal(2)
        expect(data.capturedPiece).to.equal(null)
      })
    })
  })

  describe(`when constructed with SAN`, () => {
    let recPawn: MoveRecord
    let recKnight: MoveRecord

    before(() => {
      recPawn = new MoveRecord(1, "e4")
      recKnight = new MoveRecord(1, "Nf3")
    })

    describe(`and evaluated in positional context`, () => {
      let position: Position

      before(() => {
        position = new Position("4k2r/4p3/R7/2B3B1/8/8/4P3/R3K1N1 w Qk -")
      })

      it(`return valid MoveData object for pawn move`, () => {
        const data = recPawn.eval(position)
        expect(data).to.exist
        expect(data.flags).to.equal(MoveFlags.Quiet)
        expect(data.fromRow).to.equal(6)
        expect(data.toRow).to.equal(4)
        expect(data.fromColumn).to.equal(4)
        expect(data.toColumn).to.equal(4)
        expect(data.capturedPiece).to.equal(null)
      })

      it(`return valid MoveData object for knight move`, () => {
        const data = recKnight.eval(position)
        expect(data).to.exist
        expect(data.flags).to.equal(MoveFlags.Quiet)
        expect(data.fromRow).to.equal(7)
        expect(data.toRow).to.equal(5)
        expect(data.fromColumn).to.equal(6)
        expect(data.toColumn).to.equal(5)
        expect(data.capturedPiece).to.equal(null)
      })

      it(`can distinct between two rook moves with different rank`, () => {
        let rec = new MoveRecord(1, "R1a3")
        let data = rec.eval(position)
        expect(data).to.exist
        expect(data.flags).to.equal(MoveFlags.Quiet)
        expect(data.fromRow).to.equal(7)
        expect(data.toRow).to.equal(5)
        expect(data.fromColumn).to.equal(0)
        expect(data.toColumn).to.equal(0)
        expect(data.capturedPiece).to.equal(null)

        rec = new MoveRecord(1, "R6a3")
        data = rec.eval(position)
        expect(data).to.exist
        expect(data.flags).to.equal(MoveFlags.Quiet)
        expect(data.fromRow).to.equal(2)
        expect(data.toRow).to.equal(5)
        expect(data.fromColumn).to.equal(0)
        expect(data.toColumn).to.equal(0)
        expect(data.capturedPiece).to.equal(null)
      })

      it(`can distinct between two bishop moves with different file`, () => {
        let rec = new MoveRecord(1, "Bcxe7")
        let data = rec.eval(position)
        expect(data).to.exist
        expect(data.flags).to.equal(MoveFlags.Capture)
        expect(data.fromRow).to.equal(3)
        expect(data.toRow).to.equal(1)
        expect(data.fromColumn).to.equal(2)
        expect(data.toColumn).to.equal(4)
        expect(data.capturedPiece).to.exist

        rec = new MoveRecord(1, "Bgxe7")
        data = rec.eval(position)
        expect(data).to.exist
        expect(data.flags).to.equal(MoveFlags.Capture)
        expect(data.fromRow).to.equal(3)
        expect(data.toRow).to.equal(1)
        expect(data.fromColumn).to.equal(6)
        expect(data.toColumn).to.equal(4)
        expect(data.capturedPiece).to.exist
      })
    })
  })
})
