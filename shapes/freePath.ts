import { Point } from "../@types";
import { Drawable } from "../scribble/drawable";

export class FreePath implements Drawable {
  constructor(private points: Point[]) {}

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
  }

  move(dx: number, dy: number) {
    this.points = this.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
  }

  isHit(point: Point) {
    return this.points.some((p) => {
      const d = Math.hypot(p.x - point.x, p.y - point.y);
      return d < 5;
    });
  }
}
