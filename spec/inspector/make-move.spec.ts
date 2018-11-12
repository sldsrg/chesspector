import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinon_chai from 'sinon-chai'
import { Subscription } from 'rxjs'

import { Inspector, Position, IAction, ActionType, MoveData, MoveFlags, Piece } from '../../src'
const expect = chai.expect
chai.use(sinon_chai)

describe('Inspector class', () => {
  let inspector: Inspector
  let subscription: Subscription
  let spy: sinon.SinonSpyStatic

  describe('whites to move', () => {

    beforeEach(() => {
      const pos = new Position('r3k2r/p2p2P1/8/8/8/8/4P3/R3K3 w qQ -')
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
      inspector.makeMove(md!)
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith({
        from: {row: 6, column: 4},
        to: {row: 4, column: 4},
        type: ActionType.Move
      })
    })

    it('push two "move" actions for long castling move', () => {
      const md = inspector.getMove('e1', 'c1')
      inspector.makeMove(md!)
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
      const md = inspector.getMove('a1', 'a7')
      inspector.makeMove(md!)
      expect(spy).to.have.been.calledTwice
      expect(spy).to.have.been.calledWith({
        type: ActionType.Move,
        from: {row: 7, column: 0},
        to: {row: 1, column: 0}
      })
      expect(spy).to.have.been.calledWith({
        type: ActionType.Delete,
        from: {row: 1, column: 0},
        code: 'p'
      })
    })

    it('change position after capture', () => {
      const md = inspector.getMove('a1', 'a7')
      inspector.makeMove(md!)
      expect(inspector.FEN).to.equal('r3k2r/R2p2P1/8/8/8/8/4P3/4K3 b Qq -')
    })

    it.only('push "move", "delete", "delete" and "insert" actions on promotion with capture', () => {
      const rook = new Piece(0, 7, false, 'r')
      const md = new MoveData(
        {row: 1, column: 6}, {row: 0, column: 7},
        MoveFlags.PawnPromotion | MoveFlags.Capture, rook, 'B' )
      inspector.makeMove(md)
      expect(spy).to.have.callCount(4)
      expect(spy).to.have.been.calledWith({
        type: ActionType.Move,
        from: {row: 1, column: 6},
        to: {row: 0, column: 7}
      })
      expect(spy).to.have.been.calledWith({
        type: ActionType.Delete,
        from: {row: 0, column: 7},
        code: 'r'
      })
      expect(spy).to.have.been.calledWith({
        type: ActionType.Delete,
        from: {row: 0, column: 7},
        code: 'P'
      })
      expect(spy).to.have.been.calledWith({
        type: ActionType.Insert,
        to: {row: 0, column: 7},
        code: 'B'
      })
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
      inspector.makeMove(md!)
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith({
        from: {row: 1, column: 3},
        to: {row: 3, column: 3},
        type: ActionType.Move
      })
    })

    it('push two "move" actions for long castling move', () => {
      const md = inspector.getMove('e8', 'c8')
      inspector.makeMove(md!)
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
      inspector.makeMove(md!)
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
