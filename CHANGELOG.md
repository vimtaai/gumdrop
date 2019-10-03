# Changelog

## Version 4.1.0 (2019-10-03)

- ➕ Markdown files can now be loaded in front matter
- ➕ Enable file loading in YAML data files
- ➕ Data files can be loaded from any folder not just `data`
- 🛠️ Fixed bug: thematic break in MD caused front matter parsing to fail

## Version 4.0.1 (2019-09-17)

- 🛠️ Fixed bug: front matter separation didn't work with UNIX style LF

## Version 4.0.0 (2019-09-12)

- ➕ Enable YAML front matters
- ➕ Enable YAML data files
- ➕ Enable multiple data files in one document
- ➕ Automatic title updates based on the first `h1` header
- ➕ Scroll to the top of a page on internal navigation
- ➕ Add `active` class for internal links pointing to the current page
- ➕ Default error message for 404 HTTP errors
- 🔁 Changed Markdown parser to [ExtraMark](https://github.com/vimtaai/extramark)
- 🔁 Changed templating method to use [mustache templates](http://mustache.github.io/) (⚡)
- 🔁 Changed syntax highlighter to [Prism](https://prismjs.com/) for faster load times (⚡)
- 🔁 Changed the way data is loaded from data files (⚡)
