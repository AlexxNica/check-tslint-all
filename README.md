# check-tslint-all

Install globally and run `check-tslint-all` in a directory with `tslint.json` and `node_modules` to
list rules that haven't yet been specified in `tslint.json`.

This is useful to keep up to date with rules that come out with newer versions of tslint and other custom rules
as specified in `extends` or `rulesDirectory` (e.g. tslint-immutable, tslint-react).

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
