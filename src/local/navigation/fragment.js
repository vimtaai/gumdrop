export function scrollToFragment(location) {
  console.log(location);
  if (!location.fragment) {
    return;
  }

  const fragmentElement = document.getElementById(location.fragment);

  if (fragmentElement !== null) {
    console.log(fragmentElement);
    fragmentElement.scrollIntoView({ block: "start" });
  } else {
    window.scrollTo({ top: 0 });
  }
}
