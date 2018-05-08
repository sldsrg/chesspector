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

  describe('whites to move', () => {

    beforeEach(() => {
      const pos = new Position('r3k3/3p4/8/8/8/8/4P3/R3K3 w qQ -')
      inspector = new Inspector(pos)
      spy = sinon.spy()
      subscription = inspector.actions.subscribe(spy)
    })

    afterEach(() => {
      subscription.unsubscribe()
    })

    it('try to move black piece failed', () => {
      expect(() => inspector.getMove('d7', 'd5')).to.throw('Try to move black piece on whites turn')
    })

    it('push single "move" action for quiet move (no castling)', () => {
      const md = inspector.getMove('e2', 'e4')
      inspector.doMove(md!)
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith({
        from: {row: 6, column: 4},
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

    it('push "move" and "delete" actions for capture', () => {
      const md = inspector.getMove('a1', 'a8')
      inspector.doMove(md!)
      expect(spy).to.have.been.calledTwice
      expect(spy).to.have.been.calledWith({
        type: ActionType.Move,
        from: {row: 7, column: 0},
        to: {row: 0, column: 0}
      })
      expect(spy).to.have.been.calledWith({
        type: ActionType.Delete,
        from: {row: 0, column: 0},
        code: 'r'
      })
    })

    it('change position after capture', () => {
      const md = inspector.getMove('a1', 'a8')
      inspector.doMove(md!)
      expect(inspector.FEN).to.equal('R3k3/3p4/8/8/8/8/4P3/4K3 w - -')
    })

  })

  describe('blacks to move', () => {
    beforeEach(() => {
      const pos = new Position('r3k3/3p4/8/8/8/8/4P3/R3K3 b qQ -')
      inspector = new Inspector(pos)
      spy = sinon.spy()
      subscription = inspector.actions.subscribe(spy)
    })

    afterEach(() => {
      subscription.unsubscribe()
    })

    it('try to move white piece failed', () => {
      expect(() => inspector.getMove('e2', 'e4')).to.throw('Try to move white piece on blacks turn')
    })

    it('push single "move" action for quiet move (no castling)', () => {
      const md = inspector.getMove('d7', 'd5')
      inspector.doMove(md!)
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith({
        from: {row: 1, column: 3},
        to: {row: 3, column: 3},
        type: ActionType.Move
      })
    })

    it('push two "move" actions for long castling move', () => {
      const md = inspector.getMove('e8', 'c8')
      inspector.doMove(md!)
      expect(spy).to.have.been.calledTwice
      expect(spy).to.have.been.calledWith({
        type: ActionType.Move,
        from: {row: 0, column: 4},
        to: {row: 0, column: 2}
      })
      expect(spy).to.have.been.calledWith({
        type: ActionType.Move,
        from: {row: 0, column: 0},
        to: {row: 0, column: 3}
      })
    })

    it('push "move" and "delete" actions for capture', () => {
      const md = inspector.getMove('a8', 'a1')
      inspector.doMove(md!)
      expect(spy).to.have.been.calledTwice
      expect(spy).to.have.been.calledWith({
        type: ActionType.Move,
        from: {row: 0, column: 0},
        to: {row: 7, column: 0}
      })
      expect(spy).to.have.been.calledWith({
        type: ActionType.Delete,
        from: {row: 7, column: 0},
        code: 'R'
      })
    })
  })
})
