# Gumdrop

[![Version][badge-version]](https://www.npmjs.com/package/gumdrop)
[![License][badge-license]](https://github.com/vimtaai/gumdrop/blob/master/LICENSE.md)
[![Code style][badge-style]](https://github.com/prettier/prettier)

> Zero-configuration script to display Markdown documents as static HTML pages

**Gumdrop** is designed to be an easy to use, standalone script that can generate websites and documentations written in [Markdown](https://daringfireball.net/projects/markdown/syntax). It dinamically loads all its dependencies from a CDN (including the Markdown parser) and does not require any configuration or initialization.

## Installation

**Gumdrop** does not require installation you just have to load it into an HTML document with a `script` tag.

```html
<script src="https://cdn.jsdelivr.net/npm/gumdrop@4"></script>
```

## Usage

To create a static website with Markdown all you need to to is to create a HTML template (`index.html`) on your file server and add **Gumdrop** as an external script file.

```html
<main></main>
<script src="path/to/gumdrop.js">
```

> Be aware, that you have to serve your files via `http`/`https` protocol, as the `file` protocol does not support fetch requests.

Markdown files in the `pages` folder can be loaded. **Gumdrop** watches the hash fragment of the URL and loads the corresponding Markdown file from the `pages` folder. The parsed Markdown files get rendered in the `<main>` HTML node if present, in `body` otherwise. The default file that gets loaded if no file is specified is `pages/index.md`. To create a link to another file in the `pages` folder simply create a fragment link with its name.

```md
[Link to about.md](#about)
```

Static resources (e.g. images) can be loaded from any folder that is served by your file server, paths are relative to `index.html`. Error pages for various HTTP errors can be placed in the `errors` folder. Each file should be named according to the HTTP error code it represents (e.g. `errors/404.md`).

Additional data can be specified for your documents in a [YAML Front Matter](https://yaml.org/). You can access this data in any of your Markdown documents with [mustache](http://mustache.github.io/) templates. 

You can also use separate files to store data and link these resource files to a document in the front matter. Resource files can use YAML (default), JSON or Markdown type. Any value in a document's front matter that is annotated with the `!file` type is considered a file resource. File paths starting with a leading `/` are relative to `index.html`, if the leading `/` is missing then the `data` folder is assumed as the resource location. If no file type (extension) is given then the `.yaml` extension is assumed. For `.md` resource files the returned value will be the rendered Markdown document.

```yaml
# data/todo.yaml

todos:
  - title: First todo
    text: Complete your first assignment
    completed: true
  - title: YAML
    text: Learn more about YAML Front Matters
    completed: false
```

```
---
todos: !file todo.yaml
---
{{#todos}}
- **{{title}}**: {{text}} {{#completed}}(✔){{/completed}}
{{/todos}}
```

### Features

- Zero configuration, no initialization needed
- No server side code, only needs a static file server
- No build/generation step, it's just files you serve
- Extra Markdown features via [ExtraMark](https://github.com/vimtaai/extramark)
- Navigation by [fetch requests](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Local caching of files for faster load times
- Additional data in front matter and data files handled by [mustache](http://mustache.github.io/) templates
- Error pages for various HTTP error codes (404, 500, 300)

### Syntax highlighting

Fenced code blocks are automatically processed by [Prism.js](https://prismjs.com/). Languages supported are the default languages in the Prism.js bundle. For syntax highlighting you have to include a **Prism.js** style in your `index.html`.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism.css" />
```

### Using with GitHub Pages

You can use **Gumdrop** with [GitHub Pages](https://pages.github.com) as it can serve as a static file server. To prevent GitHub Pages from trying to transform your site with Jekyll add an empty `.nojekyll` file to the root of your site.

## Contributing

All ideas, recommendations, bug reports, pull requests are welcome. :smile:

[badge-version]: https://img.shields.io/npm/v/gumdrop.svg?style=flat-square
[badge-license]: https://img.shields.io/npm/l/gumdrop.svg?style=flat-square
[badge-style]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
