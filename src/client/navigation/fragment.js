export function scrollToFragment(fragment) {
  const elem = window.document.getElementById(fragment);

  if (elem === null) {
    window.scrollTo({ top: 0 });
  } else {
    elem.scrollIntoView({ block: "start" });
  }
}
