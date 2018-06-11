# Gumdrop

![NPM version 1.1.1](https://img.shields.io/badge/npm-1.1.1-blue.svg)

> Script to display Markdown documents as static HTML pages

## About

**Gumdrop** is designed to be an easy to use, standalone script that can generate websites and documentations written in [Markdown](https://daringfireball.net/projects/markdown/syntax). It is bundled with all its dependencies (including [markdown-it](https://github.com/markdown-it/markdown-it) - a Markdown parser) and does not require any configuration or initialization.

## Features

The script automatically parses Markdown documents and displays them in the browser. Navigation between local pages is handled by [fetch requests](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and they are cached to decrease network traffic.

You can also set up your own JSON data files and iterate through them to display a collection of items, such as links, people or blog posts.

## Usage

To create a static website with Markdown all you need to to is to create a HTML template (`index.html`) on the root of your file server and add **Gumdrop** as an external script file.

```html
<main></main>
<script src="path/to/gumdrop.js">
```

Markdown files in the `pages` folder can be loaded. **Gumdrop** watches the hash fragment of the URL and loads the corresponding Markdown file from the `pages` folder. The parsed Markdown files get rendered in the `<main>` HTML node. The default file that gets loaded if no file is specified is `pages/index.md`. To create a link to another file in the `pages` folder simply create a fragment link with its name.

```md
[Link to about.md](#about)
```

To use collections create JSON files in the `data` folder. Each of your data files should be an array of objects. You can iterate through your data in the HTML template in `index.html` with the `data-each` attribute by setting the name of the data file as the value. Inside the template you can reference the properties of each object in your array with double brackets.

```json
// data/pages.json

[
  { "title": "Main Page", "url": "#index" },
  { "title": "About", "url": "#about" }
]
```

```html
// index.html

<ul>
  <li data-each="pages">
    <a href="{{url}}">{{title}}</a>
  </li>
</ul>
```

Static resources (e.g. images) can be loaded from any folder that is served by your file server, paths are relative to `index.html`.

## Prerequisites

In order to work, **Gumdrop** requires a static HTTP(S) file server as the Fetch API does not work with the `file:` protocol. **Gumdrop** requires a browser that supports the Fetch API thus Internet Explorer is not supported.

## Contributing

All ideas, recommendations, bug reports, pull requests are welcome. :smile: