import 'mocha'
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinon_chai from 'sinon-chai'
import { Subscription } from 'rxjs'

import { Inspector, Position, ActionType, MoveData, MoveFlags, Piece } from '../../src'

const expect = chai.expect
chai.use(sinon_chai)

describe('umakeMove method (Inspector class)', () => {
  let inspector: Inspector
  let subscription: Subscription
  let spy: sinon.SinonSpyStatic

  beforeEach(() => {
    const pos = new Position('r3k2B/p2p4/7N/8/8/3Q4/4P3/2KR4 b q -')
    inspector = new Inspector(pos)
    spy = sinon.spy()
    subscription = inspector.actions.subscribe(spy)
  })

  afterEach(() => {
    subscription.unsubscribe()
  })

  it('change position after unmake move', () => {
    const md = new MoveData(
      {row: 6, column: 3}, {row: 5, column: 3}, MoveFlags.Quiet )
    inspector.unmakeMove(md)
    expect(spy).to.have.been.calledOnce
    expect(inspector.FEN).to.equal('r3k2B/p2p4/7N/8/8/8/3QP3/2KR4 w q -')
  })

  it('try to unmake wrong move failed', () => {
    const md = new MoveData(
      {row: 6, column: 0}, {row: 5, column: 0}, MoveFlags.Quiet )
    expect(() => inspector.unmakeMove(md)).to.throw('Piece not found at a3')
  })

  it('push single "move" action when umake quiet move (no castling)', () => {
    const md = new MoveData(
      {row: 6, column: 3}, {row: 5, column: 3}, MoveFlags.Quiet )
    inspector.unmakeMove(md)
    expect(spy).to.have.been.calledOnce
    expect(spy).to.have.been.calledWith({
      from: {row: 5, column: 3},
      to: {row: 6, column: 3},
      type: ActionType.Move
    })
  })

  it('push two "move" actions when unmake long castling move', () => {
    const md = new MoveData(
      {row: 7, column: 4}, {row: 7, column: 2}, MoveFlags.CastlingLong )
    inspector.unmakeMove(md)
    expect(spy).to.have.been.calledTwice
    expect(spy).to.have.been.calledWith({
      type: ActionType.Move,
      from: {row: 7, column: 2},
      to: {row: 7, column: 4}
    })
    expect(spy).to.have.been.calledWith({
      type: ActionType.Move,
      from: {row: 7, column: 3},
      to: {row: 7, column: 0}
    })
  })

  it('push "insert" and "move" actions when unmake capture', () => {
    const captured = new Piece(2, 7, false, 'P')
    const md = new MoveData(
      {row: 4, column: 6}, {row: 2, column: 7},
      MoveFlags.Capture, captured )
    inspector.unmakeMove(md)
    expect(spy).to.have.been.calledTwice
    expect(spy).to.have.been.calledWith({
      type: ActionType.Insert,
      to: {row: 2, column: 7},
      code: 'p'
    })
    expect(spy).to.have.been.calledWith({
      type: ActionType.Move,
      from: {row: 2, column: 7},
      to: {row: 4, column: 6}
    })
  })

  it('restore castling ability flag when unmake castle move', () => {
    const md = new MoveData(
      {row: 7, column: 4}, {row: 7, column: 2}, MoveFlags.CastlingLong )
    inspector.unmakeMove(md)
    expect(spy).to.have.been.calledTwice
    expect(inspector.FEN).to.equal('r3k2B/p2p4/7N/8/8/3Q4/4P3/R3K3 w Qq -')
  })

  xit('restore en-passant file when unmake capture en-passant move', () => {
  })

  xit('restore pawn when unmake promotion with capture move', () => {
    const rook = new Piece(0, 7, false, 'r')
    const md = new MoveData(
      {row: 1, column: 6}, {row: 0, column: 7},
      MoveFlags.PawnPromotion | MoveFlags.Capture, rook, 'B' )
    inspector.unmakeMove(md)
    expect(spy).to.have.been.calledThrice
    expect(spy).to.have.been.calledWith({
      type: ActionType.Delete,
      from: {row: 0, column: 7}
    })
    expect(spy).to.have.been.calledWith({
      type: ActionType.Insert,
      to: {row: 0, column: 7},
      code: 'P'
    })
    expect(spy).to.have.been.calledWith({
      type: ActionType.Move,
      from: {row: 0, column: 7},
      to: {row: 1, column: 6}
    })
  })
})
