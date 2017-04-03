# check-tslint-all

[![Greenkeeper badge](https://badges.greenkeeper.io/khoomeister/check-tslint-all.svg)](https://greenkeeper.io/)

Install globally and run `check-tslint-all` in a directory with `tslint.json` and `node_modules` to
list rules that haven't been specified in `tslint.json`.

This is useful to keep up to date with rules that come out with newer versions of tslint and other custom rules
as specified in the [extends or rulesDirectory](https://palantir.github.io/tslint/usage/tslint-json/) properties of `tslint.json`.

**Example**

```sh
$ check-tslint-all

Unspecified rules in tslint.json
================================
align
array-type
ban
ban-types
completed-docs
curly
...
```
