import MoveParser from "../app/moveparser"
import MoveRecord from "../app/moverecord"

describe(`MoveParser`, () => {

  describe(`when parse single line of moves recorded in LAN`, () => {
    let first: MoveRecord

    beforeAll(() => {
      const parser = new MoveParser("1.e2-e4 e7-e5 2.Ng1-f3 Nb8-c6 3.Bf1-c4")
      first = parser.parse()
    })

    it(`return non empty result`, () => {
      expect(first).not.toBeNull()
    })

    it(`number of nodes from first evaluates to correct value`, () => {
      expect(first.length).toBe(5)
    })
  })

  describe(`when parse single line of moves recorded in SAN`, () => {
    let first: MoveRecord

    beforeAll(() => {
      const parser = new MoveParser("1.e4 e5 2.Nf3 Nc6 3.Bc4")
      first = parser.parse()
    })

    it(`return non empty result`, () => {
      expect(first).not.toBeNull()
    })

    it(`number of nodes from first evaluates to correct value`, () => {
      expect(first.length).toBe(5)
    })
  })

  describe(`when parse moves with forks`, () => {
    let first: MoveRecord

    beforeAll(() => {
      const parser = new MoveParser("1.e4 e5 2.Nf3 (2.Nc3 Nc6 3.Nf3) Nc6 3.Bc4")
      first = parser.parse()
    })

    it(`return non empty result`, () => {
      expect(first).not.toBeNull()
    })

    it(`number of nodes from first evaluates to correct value`, () => {
      expect(first.length).toBe(5)
    })
  })

  describe(`when parse single line of moves with comment`, () => {
    let first: MoveRecord

    beforeAll(() => {
      const parser = new MoveParser("1.e2-e4 e7-e5 {simple comment} 2.Ng1-f3 Nb8-c6 3.Bf1-c4")
      first = parser.parse()
    })

    it(`number of nodes from first evaluates to correct value`, () => {
      expect(first.length).toBe(5)
    })

    it(`and comment text is correct`, () => {
      expect(first.next.comment).toBe("simple comment")
    })
  })
})
