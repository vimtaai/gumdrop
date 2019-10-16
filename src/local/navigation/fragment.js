export function scrollToFragment(location) {
  const fragmentElement = document.getElementById(location.fragment);

  if (fragmentElement !== null) {
    fragmentElement.scrollIntoView({ block: "start" });
  } else {
    window.scrollTo({ top: 0 });
  }
}
