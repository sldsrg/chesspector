import 'mocha'
import { expect } from 'chai'

import { MoveData, MoveFlags, ActionType, newPiece } from '../src'

describe('MoveData actions getter', () => {
  it('return move action for quiet move', () => {
    const data = new MoveData(6, 4, 4, 4, MoveFlags.Quiet)
    const res = data.actions
    expect(res.length).to.equal(1)
    expect(res[0]).to.deep.equal({
      type: ActionType.Move,
      from: { row: 6, column: 4},
      to: {row: 4, column: 4}
    })
  })

  it('return move and delete actions for capture move', () => {
    const data = new MoveData(6, 4, 5, 5, MoveFlags.Capture, newPiece('p', 5, 5))
    const res = data.actions
    expect(res.length).to.equal(2)
    expect(res[0]).to.deep.equal({
      type: ActionType.Move,
      from: { row: 6, column: 4},
      to: {row: 5, column: 5}
    })
    expect(res[1]).to.deep.equal({
      type: ActionType.Delete,
      from: { row: 5, column: 5},
      code: 'p'
    })
  })

  it('return move and delete actions for capture en-passant move', () => {
    const data = new MoveData(3, 4, 2, 5, MoveFlags.CaptureEnPassant, newPiece('p', 3, 5))
    const res = data.actions
    expect(res.length).to.equal(2)
    expect(res[0]).to.deep.equal({
      type: ActionType.Move,
      from: { row: 3, column: 4},
      to: {row: 2, column: 5}
    })
    expect(res[1]).to.deep.equal({
      type: ActionType.Delete,
      from: { row: 3, column: 5},
      code: 'p'
    })
  })

  it('return two move actions for short castling move', () => {
    const data = new MoveData(7, 4, 7, 6, MoveFlags.CastlingShort)
    const res = data.actions
    expect(res.length).to.equal(2)
    expect(res[0]).to.deep.equal({
      type: ActionType.Move,
      from: { row: 7, column: 4},
      to: {row: 7, column: 6}
    })
    expect(res[1]).to.deep.equal({
      type: ActionType.Move,
      from: { row: 7, column: 7},
      to: {row: 7, column: 5}
    })
  })

  it('return two move actions for long castling move', () => {
    const data = new MoveData(7, 4, 7, 1, MoveFlags.CastlingLong)
    const res = data.actions
    expect(res.length).to.equal(2)
    expect(res[0]).to.deep.equal({
      type: ActionType.Move,
      from: { row: 7, column: 4},
      to: {row: 7, column: 1}
    })
    expect(res[1]).to.deep.equal({
      type: ActionType.Move,
      from: { row: 7, column: 0},
      to: {row: 7, column: 3}
    })
  })

  it('return three move actions for pawn promotion move', () => {
    const data = new MoveData(6, 2, 7, 2, MoveFlags.PawnPromotion, undefined, 'Q')
    const res = data.actions
    expect(res.length).to.equal(3)
    expect(res[0]).to.deep.equal({
      type: ActionType.Move,
      from: { row: 6, column: 2},
      to: {row: 7, column: 2}
    })
    expect(res[1]).to.deep.equal({
      type: ActionType.Delete,
      from: { row: 7, column: 2}
    })
    expect(res[2]).to.deep.equal({
      type: ActionType.Insert,
      to: { row: 7, column: 2},
      code: 'Q'
    })
  })
})
