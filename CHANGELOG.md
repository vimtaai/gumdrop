# Changelog

## Version 4.0.0 (2019-09-11)

- **Added** YAML front matters
- **Added** option for YAML data files
- **Added** automatic title updates based on the first `h1` header
- **Added** option to load multiple data files in one document
- **Added** a feature that scrolls to the top of a page on internal navigation
- **Added** `active` class for internal links pointing at the current page
- **Added** default error message for 404 HTTP errors
- **Changed** Markdown parser to [ExtraMark](https://github.com/vimtaai/extramark)
- **Changed** templating method to use [mustache templates](http://mustache.github.io/) **(breaking change)**
- **Changed** syntax highlighter to [Prism](https://prismjs.com/) for faster load times **(breaking change)**
- **Changed** the way data is loaded from data files **(breaking change)**
- **Updated** network and CDN handling
