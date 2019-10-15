export function scrollToFragment(location) {
  if (!location.fragment) {
    return;
  }

  const fragmentElement = document.getElementById(location.fragment);

  if (fragmentElement) {
    window.scrollTo({ top: 0 });
  } else {
    fragmentElement.scrollIntoView({ block: "start" });
  }
}
