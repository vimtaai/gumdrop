import { Window } from "happy-dom";
import { afterEach, beforeEach, mock } from "node:test";

beforeEach(() => {
  const window = new Window({ url: "http://test.url" });
  global.window = window;
});

afterEach(() => {
  global.window.happyDOM.close();
});
