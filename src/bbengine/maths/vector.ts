export class Vector 
{
  constructor(public x: number, public y: number) { }

  public static zero = new Vector(0, 0);

  public equals(v: Vector, tolerance: number = .001): boolean 
  {
    return Math.abs(this.x - v.x) <= tolerance && Math.abs(this.y - v.y) <= tolerance;
  }

  public distance(v?: Vector): number
  {
    if (!v)
    {
      v = Vector.zero;
    }

    return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
  }

  public add(v: Vector): Vector 
  {
    return new Vector(this.x + v.x, this.y + v.y);
  }
}
