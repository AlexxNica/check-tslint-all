"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const lodash_1 = require("lodash");
const path = require("path");
const helpers_1 = require("./helpers");
const ARG1 = 2;
const UNSPECIFIED_RULES_ERROR = 1;
const MISSING_FILES_ERROR = 2;
const TSLINT_RULE_DIRECTORY = 'node_modules/tslint/lib/rules';
if (process.argv[ARG1] === '--version') {
    const packageJSONFileName = path.resolve(__dirname, '../package.json');
    console.log(JSON.parse(fs.readFileSync(packageJSONFileName).toString())['version']);
    process.exit(0);
}
if (!fs.existsSync('tslint.json')) {
    helpers_1.log('Missing tslint.json');
    process.exit(MISSING_FILES_ERROR);
}
if (!fs.existsSync('node_modules')) {
    helpers_1.log(`Missing node_modules`);
    process.exit(MISSING_FILES_ERROR);
}
const mainConfig = helpers_1.readConfigFile('tslint.json');
const myRules = Object.keys(mainConfig.rules);
const dirRules = lodash_1.chain(helpers_1.arrayize(mainConfig.rulesDirectory))
    .concat(TSLINT_RULE_DIRECTORY)
    .map(helpers_1.getDirRules)
    .flatten()
    .map(helpers_1.dashify)
    .value();
const extendRules = lodash_1.chain(helpers_1.arrayize(mainConfig.extends))
    .map(helpers_1.getExtendRules)
    .flatten()
    .value();
const allRules = lodash_1.chain(dirRules).concat(extendRules).uniq().sort().value();
const diffed = lodash_1.difference(allRules, myRules);
if (diffed.length === 0) {
    helpers_1.log('All rules are specified in tslint.json.');
    process.exit(0);
}
else {
    helpers_1.log('Unspecified rules in tslint.json');
    helpers_1.log('================================');
    diffed.forEach(helpers_1.log);
    process.exit(UNSPECIFIED_RULES_ERROR);
}
