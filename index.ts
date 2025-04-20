import { Scribble } from "./scribble";

declare global {
  interface Window {
    DrawingApp: typeof Scribble;
  }
}

window.DrawingApp = Scribble;
