import { Drawable } from "../scribble/drawable";
import { Point } from "../@types";

export class Circle implements Drawable {
  constructor(public x: number, public y: number, private r: number) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.stroke();
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  isHit(point: Point) {
    const d = Math.hypot(point.x - this.x, point.y - this.y);
    return d <= this.r;
  }
}
