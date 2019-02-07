import { location } from "../../location";
import { fetchContent } from "../../../network/fetch";
import { documentRoot, loaderContent } from "./document";

export async function updateContent() {
  const { page } = location.current;
  const timeoutUntilLoader = 500;

  const loaderTimer = window.setTimeout(function() {
    documentRoot.innerHTML = loaderContent;
  }, timeoutUntilLoader);

  const file = page || "index";
  const content = await fetchContent("pages", file, "md");

  documentRoot.innerHTML = content;
  window.clearTimeout(loaderTimer);
}
