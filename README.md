# Gumdrop

[![Version][badge-version]](https://www.npmjs.com/package/gumdrop)
[![License][badge-license]](https://github.com/vimtaai/gumdrop/blob/master/LICENSE.md)
[![Code style][badge-style]](https://github.com/prettier/prettier)

> Script to display Markdown documents as static HTML pages

**Gumdrop** is designed to be an easy to use, standalone script that can generate websites and documentations written in [Markdown](https://daringfireball.net/projects/markdown/syntax). It dinamically loads all its dependencies from a CDN (including the Markdown parser) and does not require any configuration or initialization.

## Installation

**Gumdrop** does not require installation you just have to load it into an HTML document with a `script` tag.

```html
<script src="https://cdn.jsdelivr.net/npm/gumdrop"></script>
```

## Usage

To create a static website with Markdown all you need to to is to create a HTML template (`index.html`) on your file server and add **Gumdrop** as an external script file.

```html
<main></main>
<script src="path/to/gumdrop.js">
```

Be aware, that you have to serve your files with `http` protocol, as the `file` protocol does not support fetch requests.

Markdown files in the `pages` folder can be loaded. **Gumdrop** watches the hash fragment of the URL and loads the corresponding Markdown file from the `pages` folder. The parsed Markdown files get rendered in the `<main>` HTML node. The default file that gets loaded if no file is specified is `pages/index.md`. To create a link to another file in the `pages` folder simply create a fragment link with its name.

```md
[Link to about.md](#about)
```

Static resources (e.g. images) can be loaded from any folder that is served by your file server, paths are relative to `index.html`. Error pages for various HTTP errors can be places in the `errors` folder. Each file should be named according to the HTTP error code it represents (e.g. `errors/404.md`).

Additional data can be specified for your documents in a [YAML Front Matter](https://yaml.org/). You can access this data in any of your Markdown documents with [mustache](http://mustache.github.io/) templates. You can also use separate files to store data and link these data files to a document in the front matter. Data files can use YAML (default) or JSON format and must be placed in the `data` folder. Any value annotated with the `!file` type is considered a file name in the `data` folder and is resolved as a data file.

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
<!-- todos.md -->

todos: !file todo
---
{{#todos}}
- **{{title}}**: {{text}} {{#completed}}[✔️]{{/completed}}
{{/todos}}
```

## Features

- Displays Markdown documents as a static website
- Automatic parsing of Markdown files
- Extra Markdown features
- Syntax highlighting with _[highlight.js](https://highlightjs.org/)_
- Navigation by [fetch requests](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Local caching for faster load times
- Error pages
- JSON collections and loops to display repeating data
- Only needs a static file server, no server side code
- No build step, it's just files you serve
- Zero configuration

### Markdown Extensions

**Gumdrop** uses [markdown-it](https://github.com/markdown-it/markdown-it) to parse Markdown documents. The parser is configured to support the following features as an addition to CommonMark:

- Tables
- Definition lists
- Containers (custom CSS classes on `div`s)
- HTML code

### Syntax highlighting

Fenced code blocks are automatically processed by _highlight.js_. Languages supported are the default languages in the _highlight.js_ bundle. For syntax highlighting you have to include a _highlight.js_ style in your `index.html`.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlightjs@9.10.0/styles/default.css" />
```

### Using with GitHub Pages

You can use **Gumdrop** with [GitHub Pages](https://pages.github.com) as it can serve as a static file server. To prevent GitHub Pages from trying to transform your site with Jekyll add an empty `.nojekyll` file to the root of your site.

## Prerequisites

In order to work, **Gumdrop** requires a static HTTP(S) file server as the Fetch API does not work with the `file:` protocol. **Gumdrop** requires a browser that supports the Fetch API thus Internet Explorer is not supported.

## Contributing

All ideas, recommendations, bug reports, pull requests are welcome. :smile:

[badge-version]: https://img.shields.io/npm/v/gumdrop.svg?style=flat-square
[badge-license]: https://img.shields.io/npm/l/gumdrop.svg?style=flat-square
[badge-style]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
