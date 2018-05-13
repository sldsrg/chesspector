import 'mocha'
import { expect } from 'chai'

import { MoveParser, MoveRecord } from '../src'

describe(`MoveParser`, () => {

  describe(`when parse single line of moves recorded in LAN`, () => {
    let first: MoveRecord

    before(() => {
      const parser = new MoveParser('1.e2-e4 e7-e5 2.Ng1-f3 Nb8-c6 3.Bf1-c4')
      first = parser.parse()
    })

    it(`number of nodes from first evaluates to correct value`, () => {
      expect(first.length).to.equal(5)
    })
  })

  describe(`when parse single line of moves recorded in SAN`, () => {
    let first: MoveRecord

    before(() => {
      const parser = new MoveParser('1.e4 e5 2.Nf3 Nc6 3.Bc4')
      first = parser.parse()
    })

    it(`return non empty result`, () => {
      expect(first).not.to.equal(null)
    })

    it(`number of nodes from first evaluates to correct value`, () => {
      expect(first.length).to.equal(5)
    })
  })

  describe(`when parse moves with forks`, () => {
    let first: MoveRecord

    before(() => {
      const parser = new MoveParser('1.e4 e5 2.Nf3 (2.Nc3 Nc6 3.Nf3) Nc6 3.Bc4')
      first = parser.parse()
    })

    it(`return non empty result`, () => {
      expect(first).not.to.equal(null)
    })

    it(`number of nodes from first evaluates to correct value`, () => {
      expect(first.length).to.equal(5)
    })
  })

  describe(`when parse single line of moves with comment`, () => {
    let first: MoveRecord

    before(() => {
      const parser = new MoveParser('1.e2-e4 e7-e5 {simple comment} 2.Ng1-f3 Nb8-c6 3.Bf1-c4')
      first = parser.parse()
    })

    it(`number of nodes from first evaluates to correct value`, () => {
      expect(first.length).to.equal(5)
    })

    it(`and comment text is correct`, () => {
      expect(first.next.comment).to.equal('simple comment')
    })
  })

  describe(`when parse of moves with forks and comments`, () => {
    let first: MoveRecord

    before(() => {
      const parser = new MoveParser('1.Kh8 Bxg6 (1...Bf5 2.Ngf6 Bd3 (2...Bc8 3.Ne4# )3.Nd7# )' +
      '(1...Be4 2.Bf5 {threat 3.Rb5#} )(1...Bd3 2.Be4 {threat 3.Rb5#} Bxc4 3.b4# )' +
      '(1...Bc2 2.Bd3 {threat 3.Rb5#} )(1...Ba2 2.Bd3 {threat 3.Rb5#} )2.Rbxg6 b5 (2...b6 3.Rc6# )3.Rc6#')
      first = parser.parse()
    })

    it(`number of nodes from first evaluates to correct value`, () => {
      expect(first.length).to.equal(5)
    })
  })

})
