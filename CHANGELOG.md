# Changelog

## Version 4.0.0 (2019-09-10)

- **Added** automatic title updates based on the first `h1` header
- **Added** YAML front matters
- **Added** option for YAML data files
- **Added** a feature that scrolls to the top of a page on internal navigation
- **Added** `active` class for internal links pointing at the current page
- **Added** default error message for 404 errors
- **Changed** markdown parser to [ExtraMark](https://github.com/vimtaai/extramark)
- **Changed** templating method to use [mustache templates](http://mustache.github.io/) **(breaking change)**
- **Changed** the way data is loaded from data files **(breaking change)**
- **Updated** network and CDN handling