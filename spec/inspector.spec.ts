import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinon_chai from 'sinon-chai'
import { Subscriber } from 'rxjs/Subscriber'
import { Subscription } from 'rxjs/Subscription'

import { Inspector, Position, IAction, ActionType, MoveData, MoveFlags } from '../src'

const expect = chai.expect
chai.use(sinon_chai)

describe('Inspector class', () => {
  let inspector: Inspector
  let subscription: Subscription
  let spy: sinon.SinonSpyStatic

  beforeEach(() => {
    const pos = new Position('4k3/8/8/8/8/8/4P3/R3K3 w Q -')
    inspector = new Inspector(pos)
    spy = sinon.spy()
    subscription = inspector.actions.subscribe(spy)
  })

  afterEach(() => {
    subscription.unsubscribe()
  })

  it('push single "move" action for quiet move (no castling)', () => {
    const md = inspector.getMove('e2', 'e4')
    inspector.doMove(md!)
    expect(spy).to.have.been.calledOnce
    expect(spy).to.have.been.calledWith({
      from: {row: 6, column:4},
      to: {row: 4, column: 4},
      type: ActionType.Move
    })
  })

  it('push two "move" actions for long castling move', () => {
    const md = inspector.getMove('e1', 'c1')
    inspector.doMove(md!)
    expect(spy).to.have.been.calledTwice
    expect(spy).to.have.been.calledWith({
      type: ActionType.Move,
      from: {row: 7, column: 4},
      to: {row: 7, column: 2}
    })
    expect(spy).to.have.been.calledWith({
      type: ActionType.Move,
      from: {row: 7, column: 0},
      to: {row: 7, column: 3}
    })
  })

})
