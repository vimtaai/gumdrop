import { Window } from "happy-dom";
import { afterEach, beforeEach } from "node:test";

beforeEach(() => {
  const window = new Window({ url: "http://localhost" });
  global.window = window;
  global.document = window.document;
});

afterEach(() => {
  global.window.happyDOM.close();
});
