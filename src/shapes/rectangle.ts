import { Point } from "../@types";
import { Drawable } from "../scribble/drawable";

export class Rectangle implements Drawable {
  constructor(
    public x: number,
    public y: number,
    private w: number,
    private h: number
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.stroke();
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  isHit(point: Point) {
    return (
      point.x >= this.x &&
      point.x <= this.x + this.w &&
      point.y >= this.y &&
      point.y <= this.y + this.h
    );
  }
}
