const CDN = `https://cdn.jsdelivr.net`;

export function loadFromCDN (packageName) {
  const script = document.createElement('script');

  script.crossOrigin = true;
  script.src = `${CDN}/${packageName}`;

  document.body.appendChild(script);
}

export default loadFromCDN;
