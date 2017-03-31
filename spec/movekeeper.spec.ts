import Movekeeper from "../app/movekeeper";

describe(`Movekeeper, when created without parameters`, () => {
  let movekeeper;

  beforeAll(()=> {
    movekeeper = new Movekeeper;
  });

  it(`contains empty move list`, () => {
    expect(movekeeper.hasMoves).toBe(false);
  });

  it(`no more empty, when added new move`, () => {
    movekeeper.add();
    expect(movekeeper.hasMoves).toBe(true);
  });

  it(`is empty again, when last move removed`, ()=> {
    movekeeper.remove();
    expect(movekeeper.hasMoves).toBe(false);
  });
});