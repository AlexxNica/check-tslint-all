"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const lodash_1 = require("lodash");
function dashify(string) {
    return string.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}
exports.dashify = dashify;
function getRules(dir) {
    if (!fs.existsSync(dir))
        return [];
    return fs.readdirSync(dir)
        .filter(file => /Rule.js$/.test(file))
        .map(file => file.substr(0, file.length - 'Rule.ts'.length));
}
function stripComments(content) {
    // tslint:disable-next-line:max-line-length
    const regexp = /("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g;
    const result = content.replace(regexp, (match, _m1, _m2, m3, m4) => {
        // Only one of m1, m2, m3, m4 matches
        if (m3 !== undefined) {
            // A block comment. Replace with nothing
            return '';
        }
        else if (m4 !== undefined) {
            // A line comment. If it ends in \r?\n then keep it.
            const length = m4.length;
            if (length > 2 && m4[length - 1] === '\n') {
                return m4[length - 2] === '\r' ? '\r\n' : '\n';
            }
            else {
                return '';
            }
        }
        else {
            // We match a string
            return match;
        }
    });
    return result;
}
// main
if (!fs.existsSync('tslint.json')) {
    console.error('Missing tslint.json');
    process.exit(-1);
}
if (!fs.existsSync('node_modules')) {
    console.error(`Missing node_modules`);
    process.exit(-1);
}
const myRules = lodash_1.flow((fileName) => fs.readFileSync(fileName).toString().replace(/^\uFEFF/, ''), stripComments, 
// tslint:disable-next-line:no-unbound-method
JSON.parse, json => Object.keys(json.rules))('tslint.json');
const allRules = lodash_1.chain([
    'node_modules/tslint/lib/rules/',
    'node_modules/tslint-immutable/a/rules/',
    'node_modules/tslint-react/rules/',
])
    .map(getRules)
    .flatten()
    .map(dashify)
    .uniq()
    .value();
console.log('Unspecified rules in tslint.json');
console.log('================================');
lodash_1.difference(allRules, myRules).forEach(item => console.log(item));
