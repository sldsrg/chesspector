import 'mocha'
import { expect } from 'chai'

import { MoveRecord, MoveFlags, Position } from '../src'

describe(`MoveRecord`, () => {
  describe(`when constructed with LAN`, () => {
    it('correct handle check sign', () => {
      const rec = new MoveRecord(1, true, 'Qd8-d3+')
      expect(rec.toString()).to.be.equal('1.Qd8-d3+')
    })

    it('correct handle checkmate sign', () => {
      const rec = new MoveRecord(1, true, 'Qd8-d3#')
      expect(rec.toString()).to.be.equal('1.Qd8-d3#')
    })

    describe(`and evaluated in positional context`, () => {
      let position: Position

      before(() => {
        position = new Position('4k2r/4p3/R7/2B3B1/8/8/4P3/R3K1N1 w Qk -')
      })

      it(`return valid MoveData object for pawn move`, () => {
        const rec = new MoveRecord(1, true, 'e2-e4')
        const data = rec.eval(position)
        expect(data!.flags).to.equal(MoveFlags.Quiet)
        expect(data!.from).to.deep.equal({row: 6, column: 4})
        expect(data!.to).to.deep.equal({row: 4, column: 4})
        expect(data!.capturedPiece).to.be.undefined
      })

      it(`return valid MoveData object for knight move`, () => {
        const rec = new MoveRecord(1, true, 'Ng1-f3')
        const data = rec.eval(position)
        expect(data!.flags).to.equal(MoveFlags.Quiet)
        expect(data!.from).to.deep.equal({row: 7, column: 6})
        expect(data!.to).to.deep.equal({row: 5, column: 5})
        expect(data!.capturedPiece).to.be.undefined
      })

      it(`return valid MoveData object for long castling`, () => {
        const rec = new MoveRecord(1, true, 'O-O-O')
        const data = rec.eval(position)
        expect(data!.flags).to.equal(MoveFlags.CastlingLong)
        expect(data!.from).to.deep.equal({row: 7, column: 4})
        expect(data!.to).to.deep.equal({row: 7, column: 2})
        expect(data!.capturedPiece).to.be.undefined
      })
    })
  })

  describe(`when constructed with SAN`, () => {

    it('correct handle check sign', () => {
      const rec = new MoveRecord(1, true, 'Qd3+')
      expect(rec.toString()).to.be.equal('1.Qd3+')
    })

    it('correct handle checkmate sign', () => {
      const rec = new MoveRecord(1, true, 'Qd3#')
      expect(rec.toString()).to.be.equal('1.Qd3#')
    })

    describe(`and evaluated in positional context`, () => {
      let position: Position
      let recPawn: MoveRecord
      let recKnight: MoveRecord

      before(() => {
        recPawn = new MoveRecord(1, true, 'e4')
        recKnight = new MoveRecord(1, true, 'Nf3')
      })

      before(() => {
        position = new Position('4k2r/4p3/R7/2B3B1/8/8/4P3/R3K1N1 w Qk -')
      })

      it(`return valid MoveData object for pawn move`, () => {
        const data = recPawn.eval(position)
        expect(data!.flags).to.equal(MoveFlags.Quiet)
        expect(data!.from).to.deep.equal({row: 6, column: 4})
        expect(data!.to).to.deep.equal({row: 4, column: 4})
        expect(data!.capturedPiece).to.be.undefined
      })

      it(`return valid MoveData object for knight move`, () => {
        const data = recKnight.eval(position)
        expect(data!.flags).to.equal(MoveFlags.Quiet)
        expect(data!.from).to.deep.equal({row: 7, column: 6})
        expect(data!.to).to.deep.equal({row: 5, column: 5})
        expect(data!.capturedPiece).to.be.undefined
      })

      it(`can distinct between two rook moves with different rank`, () => {
        let rec = new MoveRecord(1, true, 'R1a3')
        let data = rec.eval(position)
        expect(data!.flags).to.equal(MoveFlags.Quiet)
        expect(data!.from).to.deep.equal({row: 7, column: 0})
        expect(data!.to).to.deep.equal({row: 5, column: 0})
        expect(data!.capturedPiece).to.be.undefined

        rec = new MoveRecord(1, true, 'R6a3')
        data = rec.eval(position)
        expect(data!.flags).to.equal(MoveFlags.Quiet)
        expect(data!.from).to.deep.equal({row: 2, column: 0})
        expect(data!.to).to.deep.equal({row: 5, column: 0})
        expect(data!.capturedPiece).to.be.undefined
      })

      it(`can distinct between two bishop moves with different file`, () => {
        let rec = new MoveRecord(1, true, 'Bcxe7')
        let data = rec.eval(position)
        expect(data!.flags).to.equal(MoveFlags.Capture)
        expect(data!.from).to.deep.equal({row: 3, column: 2})
        expect(data!.to).to.deep.equal({row: 1, column: 4})
        expect(data!.capturedPiece).not.to.be.undefined

        rec = new MoveRecord(1, true, 'Bgxe7')
        data = rec.eval(position)
        expect(data!.flags).to.equal(MoveFlags.Capture)
        expect(data!.from).to.deep.equal({row: 3, column: 6})
        expect(data!.to).to.deep.equal({row: 1, column: 4})
        expect(data!.capturedPiece).not.to.be.undefined
      })
    })
  })
})
