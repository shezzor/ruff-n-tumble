interface IEntity {
  x: number;
  y: number;
}

interface IMovable {
  gravity: number;
  speed: {
    x: number;
    y: number;
  }
}

class Entity implements IEntity
{
  public x: number;
  public y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
}