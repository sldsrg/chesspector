import 'mocha'
import { expect } from 'chai'

import { MoveData, MoveFlags, ActionType } from '../src'

describe('MoveData actions getter', () => {
  it('return move action for quiet move', () => {
    const data = new MoveData(6, 4, 4, 4, MoveFlags.Quiet)
    const res = data.actions
    expect(res.length).to.be.equal(1)
    expect(res[0].type).to.be.equal(ActionType.Move)
  })
})