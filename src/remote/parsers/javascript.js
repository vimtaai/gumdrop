export async function parseJS(rawData, defaultExportName = undefined) {
  // eslint-disable-next-line
  const parse = window.eval.bind(window);

  window.module = {};

  parse(`(function (module) {
      ${rawData}
      ${defaultExportName !== undefined ? `module.exports = ${defaultExportName};` : ``}
    })(window.module)`);

  return window.module.exports;
}
