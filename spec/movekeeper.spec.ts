import * as mocha from "mocha"
import * as chai from "chai"

import { Movekeeper, MoveRecord } from "../src"

const expect = chai.expect

describe(`MoveKeeper`, () => {
  describe(`when created without parameters`, () => {
    let movekeeper: Movekeeper

    before(() => {
      movekeeper = new Movekeeper()
    })

    it(`contains empty move list`, () => {
      expect(movekeeper.hasMoves).to.equal(false)
    })

    it(`and no more empty, when added new move`, () => {
      movekeeper.add(new MoveRecord(1, "e2-e4"))
      expect(movekeeper.hasMoves).to.equal(true)
    })

    it(`then is empty again, when last move removed`, () => {
      movekeeper.remove(movekeeper.first)
      expect(movekeeper.hasMoves).to.equal(false)
    })
  })
})
