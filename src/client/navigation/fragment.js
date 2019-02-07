import { location } from "../location";

export function scrollToFragment() {
  const { fragment } = location.current;

  if (fragment === undefined) {
    window.scrollTo({ top: 0, behavior: "auto" });
  } else {
    const elem = document.getElementById(fragment);

    if (elem !== null) {
      elem.scrollIntoView({ block: "start" });
    }
  }
}
