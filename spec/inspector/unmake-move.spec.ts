import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinon_chai from 'sinon-chai'
import { Subscriber } from 'rxjs/Subscriber'
import { Subscription } from 'rxjs/Subscription'

import { Inspector, Position, IAction, ActionType, MoveData, MoveFlags } from '../../src'

const expect = chai.expect
chai.use(sinon_chai)

describe('umakeMove method (Inspector class)', () => {
  let inspector: Inspector
  let subscription: Subscription
  let spy: sinon.SinonSpyStatic

  beforeEach(() => {
    const pos = new Position('r3k3/p2p4/8/8/8/8/4P3/R3K3 w qQ -')
    inspector = new Inspector(pos)
    spy = sinon.spy()
    subscription = inspector.actions.subscribe(spy)
  })

  afterEach(() => {
    subscription.unsubscribe()
  })

  xit('change position after unmake move', () => {
  })

  xit('try to unmake wrong move failed', () => {
  })

  xit('push single "move" action when umake quiet move (no castling)', () => {
  })

  xit('push two "move" actions when unmake long castling move', () => {
  })

  xit('push "move" and "place" actions when unmake capture', () => {
  })

  xit('restore castling ability flag when unmake castle move', () => {
  })

  xit('restore en-passant file when unmake capture en-passant move', () => {
  })

})
