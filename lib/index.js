"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const lodash_1 = require("lodash");
const helpers_1 = require("./helpers");
if (!fs.existsSync('tslint.json')) {
    console.error('Missing tslint.json');
    process.exit(-1);
}
if (!fs.existsSync('node_modules')) {
    console.error(`Missing node_modules`);
    process.exit(-1);
}
const TSLINT_RULE_DIRECTORY = 'node_modules/tslint/lib/rules';
const mainConfig = helpers_1.readConfigFile('tslint.json');
const myRules = Object.keys(mainConfig.rules);
const dirRules = lodash_1.chain(helpers_1.arrayize(mainConfig.rulesDirectory).concat(TSLINT_RULE_DIRECTORY))
    .map(helpers_1.getDirRules)
    .flatten()
    .map(helpers_1.dashify)
    .value();
const extendRules = lodash_1.chain(helpers_1.arrayize(mainConfig.extends))
    .map(helpers_1.getExtendRules)
    .flatten()
    .value();
const allRules = lodash_1.chain(dirRules).concat(extendRules).uniq().value();
console.log('Unspecified rules in tslint.json');
console.log('================================');
lodash_1.difference(allRules, myRules).forEach(item => console.log(item));
