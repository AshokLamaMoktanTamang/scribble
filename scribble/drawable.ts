import { Point } from "../@types";

export abstract class Drawable {
  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract isHit(point: Point): boolean;
  abstract move(dx: number, dy: number): void;
}
