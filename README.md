# Vimkey

---

[![NPM version][npm-badge]][npm-url]
[![spm version][spm-badge]][spm-url]
[![Build status][travis-badge]][travis-url]
[![Coveralls status][Coveralls-badge]][coveralls-url]

[npm-badge]: https://img.shields.io/npm/v/vimkey.svg?style=flat
[npm-url]: https://www.npmjs.com/package/vimkey
[spm-url]: http://spmjs.io/package/vimkey
[spm-badge]: http://spmjs.io/badge/vimkey
[travis-badge]: https://travis-ci.org/hotoo/vimkey.svg
[travis-url]: https://travis-ci.org/hotoo/vimkey
[coveralls-badge]: https://coveralls.io/repos/hotoo/vimkey/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/hotoo/vimkey

Vim-like key mapping for the web from [Vimlide](https://github.com/hotoo/Vimlide).

## Install

```
$ spm install vimkey --save
```

## Usage

```js
var Vimkey = require('vimkey');
var LINE_HEIGHT = 100;

var normalMode = new Vimkey(document, {
  countable: true,
});
normalMode.map('j', function(evt, count = 1) {
  window.scrollBy(LINE_HEIGHT * count, 0);
  evt.stopPropagation();
});
```

## API

### .map(String key, Function handler)

key mapping.
