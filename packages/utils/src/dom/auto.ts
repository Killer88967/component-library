// Entry for the <script> build (dist/cl.js): starts everything and exposes
// window.cl so plain HTML pages can call cl.toast(...).
import { cl, start } from "./index";

declare global {
  interface Window {
    cl: typeof cl;
  }
}

window.cl = cl;
start();
