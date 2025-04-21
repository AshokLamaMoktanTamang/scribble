import { Drawable } from "./scribble/drawable";
import { Mode, Point } from "./@types";
import { Circle } from "./shapes/circle";
import { FreePath } from "./shapes/freePath";
import { Rectangle } from "./shapes/rectangle";

export class Scribble {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mode: Mode = "free";
  private drawing = false;
  private resizing = false;
  private start: Point = { x: 0, y: 0 };
  private currentPath: Point[] = [];
  private shapes: Drawable[] = [];
  private selected: Drawable | null = null;
  private hoveredShape: Drawable | null = null;
  private dragOffset: Point = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.attachEvents();
  }

  public setMode(mode: Mode) {
    this.mode = mode;
  }

  public clearCanvas() {
    this.shapes = [];
    this.redraw();
  }

  private attachEvents() {
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.key === "Delete" && this.selected) {
      const index = this.shapes.indexOf(this.selected);
      if (index > -1) {
        this.shapes.splice(index, 1);
        this.selected = null;
        this.redraw();
      }
    }
  }

  private onMouseDown(e: MouseEvent) {
    const { offsetX, offsetY, shiftKey } = e;
    this.start = { x: offsetX, y: offsetY };
    this.drawing = true;

    
    if (this.mode === "free") {
      this.currentPath = [this.start];
    } else if (this.mode === "drag") {
      this.selected = this.findShapeAt(this.start);

      if (this.selected) {
        if (shiftKey) {
          this.resizing = true;
        } else {
          this.dragOffset = {
            x:
              this.start.x -
              ("x" in this.selected ? (this.selected as any).x : 0),
            y:
              this.start.y -
              ("y" in this.selected ? (this.selected as any).y : 0),
          };
        }
      }
    }
  }

  private onMouseMove(e: MouseEvent) {
    const point: Point = { x: e.offsetX, y: e.offsetY };

    if (!this.drawing && this.mode === "drag") {
      const shape = this.findShapeAt(point);
      if (shape !== this.hoveredShape) {
        this.hoveredShape = shape;
        this.canvas.style.cursor = shape ? "move" : "default";
        this.redraw();
      }
      return;
    }

    if (!this.drawing) return;

    if (this.mode === "free") {
      const prev = this.currentPath[this.currentPath.length - 1];
      this.currentPath.push(point);
      this.ctx.beginPath();
      this.ctx.moveTo(prev.x, prev.y);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
    } else if (this.mode === "drag" && this.selected) {
      const dx = point.x - this.start.x;
      const dy = point.y - this.start.y;
      this.start = point;

      if (this.resizing) {
        if (this.selected instanceof Rectangle) {
          (this.selected as any).w += dx;
          (this.selected as any).h += dy;
        } else if (this.selected instanceof Circle) {
          const newRadius = Math.sqrt(
            Math.pow((this.selected as any).radius + dx, 2) + Math.pow(dy, 2)
          );
          (this.selected as any).r = Math.max(newRadius, 5);
        }
      } else {
        this.selected.move(dx, dy);
      }

      this.redraw();
    }
  }

  private onMouseUp(e: MouseEvent) {
    const end: Point = { x: e.offsetX, y: e.offsetY };
    if (!this.drawing) return;
    this.drawing = false;
    this.resizing = false;

    switch (this.mode) {
      case "free":
        this.shapes.push(new FreePath(this.currentPath));
        break;
      case "rect":
        const w = end.x - this.start.x;
        const h = end.y - this.start.y;
        this.shapes.push(new Rectangle(this.start.x, this.start.y, w, h));
        break;
      case "circle":
        const dx = end.x - this.start.x;
        const dy = end.y - this.start.y;
        const r = Math.sqrt(dx * dx + dy * dy);
        this.shapes.push(new Circle(this.start.x, this.start.y, r));
        break;
    }

    this.selected = null;
    this.redraw();
  }

  private findShapeAt(p: Point): Drawable | null {
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i].isHit(p)) return this.shapes[i];
    }
    return null;
  }

  private redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const shape of this.shapes) {
      shape.draw(this.ctx);
    }

    if (this.hoveredShape) {
      this.ctx.save();
      this.ctx.shadowColor = "rgba(0, 0, 255, 0.6)";
      this.ctx.shadowBlur = 10;
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "blue";
      this.hoveredShape.draw(this.ctx);
      this.ctx.restore();
    }
  }
}
