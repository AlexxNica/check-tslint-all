# check-tslint-all

Install globally and run `check-tslint-all` in a directory with `tslint.json` and `node_modules` to
list rules that haven't specified in tslint.json.

Currently checks rules for:

* tslint
* tslint-immutable
* tslint-react

Example output:

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
