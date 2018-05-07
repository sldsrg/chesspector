import 'mocha'
import * as chai from 'chai'
import * as spies from 'chai-spies'
import { Subscriber } from 'rxjs/Subscriber'
import { Subscription } from 'rxjs/Subscription'

import { Inspector, Position, IAction, ActionType, MoveData } from '../src'

const expect = chai.expect
chai.use(spies)

describe('Inspector class', () => {
  let inspector: Inspector
  let subscription: Subscription
  let spy: ChaiSpies.SpyFunc0<void>

  beforeEach(() => {
    const pos = new Position('4k3/8/8/8/8/8/4P3/R3K3 w Q -')
    inspector = new Inspector(pos)
    spy = chai.spy(() => {})
    subscription = inspector.actions.subscribe(spy)
  })

  afterEach(() => {
    subscription.unsubscribe()
  })

  it('push single "move" action for quiet move (no castling)', () => {
    const md = inspector.getMove('e2', 'e4')
    inspector.doMove(md!)
    expect(spy).to.have.been.called.once
  })

  it('push two "move" actions for long castling move', () => {
    const md = inspector.getMove('e1', 'c1')
    inspector.doMove(md!)
    expect(spy).to.have.been.called.twice
  })

})
