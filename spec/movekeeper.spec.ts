import Movekeeper from "../app/movekeeper";

describe(`Movekeeper, when created without parameters`, () => {
  let movekeeper: Movekeeper;

  beforeAll(()=> {
    movekeeper = new Movekeeper;
  });

  it(`contains empty move list`, () => {
    expect(movekeeper.hasMoves).toBe(false);
  });

  it(`no more empty, when added new move`, () => {
    movekeeper.add(null);
    expect(movekeeper.hasMoves).toBe(true);
  });

  it(`is empty again, when last move removed`, ()=> {
    movekeeper.remove(null);
    expect(movekeeper.hasMoves).toBe(false);
  });
});

describe(`Movekeeper, when created with three whites move 
  and two blacks move`, () => {
    let movekeeper: Movekeeper;
    
    beforeAll(()=> {
      movekeeper = new Movekeeper("1.e2-e4 e7-e5 2.Ng1-f3 Nb8-c6 3.Bf1-c4");
    });

    it(`is not empty`, () => {
      expect(movekeeper.hasMoves).toBe(true);
    });
  });