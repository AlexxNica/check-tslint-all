"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const lodash_1 = require("lodash");
const path_1 = require("path");
const BUILT_IN_CONFIG = /^tslint:(.*)$/;
function arrayize(value) {
    if (value === undefined)
        return [];
    if (Array.isArray(value))
        return value;
    return [value];
}
exports.arrayize = arrayize;
function dashify(string) {
    return string.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}
exports.dashify = dashify;
function getDirRules(dir) {
    if (!fs.existsSync(dir))
        return [];
    return fs.readdirSync(dir)
        .filter(file => /Rule.js$/.test(file))
        .map(file => file.substr(0, file.length - 'Rule.ts'.length));
}
exports.getDirRules = getDirRules;
function getExtendRules(extend) {
    const matches = extend.match(BUILT_IN_CONFIG);
    if (matches != null && matches.length > 0)
        return [];
    return lodash_1.flow(() => require.resolve(extend), readConfigFile, config => config.rules, Object.keys)();
}
exports.getExtendRules = getExtendRules;
function readConfigFile(file) {
    if (path_1.extname(file) === '.json') {
        return lodash_1.flow(() => fs.readFileSync(file).toString().replace(/^\uFEFF/, ''), stripComments, JSON.parse)();
    }
    else {
        // tslint:disable-next-line:no-require-imports
        const config = require(file);
        delete require.cache[file];
        return config;
    }
}
exports.readConfigFile = readConfigFile;
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
