import * as fs from 'fs'
import { chain, difference } from 'lodash'
import * as path from 'path'
import {
  arrayize,
  dashify,
  getDirRules,
  getExtendRules,
  log,
  readConfigFile,
  TSLintConfig,
} from './helpers'

const ARG1 = 2
const UNSPECIFIED_RULES_ERROR = 1
const MISSING_FILES_ERROR = 2
const TSLINT_RULE_DIRECTORY = 'node_modules/tslint/lib/rules'

if (process.argv[ARG1] === '--version') {
  const packageJSONFileName = path.resolve(__dirname, '../package.json')
  console.log(JSON.parse(fs.readFileSync(packageJSONFileName).toString())['version'])
  process.exit(0)
}
if (!fs.existsSync('tslint.json')) {
  log('Missing tslint.json')
  process.exit(MISSING_FILES_ERROR)
}
if (!fs.existsSync('node_modules')) {
  log(`Missing node_modules`)
  process.exit(MISSING_FILES_ERROR)
}

const mainConfig: TSLintConfig = readConfigFile('tslint.json')

const myRules = Object.keys(mainConfig.rules)

const dirRules = chain(arrayize(mainConfig.rulesDirectory))
.concat(TSLINT_RULE_DIRECTORY)
.map(getDirRules)
.flatten()
.map(dashify)
.value()

const extendRules = chain(arrayize(mainConfig.extends))
.map(getExtendRules)
.flatten()
.value()

const allRules = chain(dirRules).concat(extendRules).uniq().sort().value()

const diffed = difference(allRules, myRules)
if (diffed.length === 0) {
  log('All rules are specified in tslint.json.')
  process.exit(0)
} else {
  log('Unspecified rules in tslint.json')
  log('================================')
  diffed.forEach(log)
  process.exit(UNSPECIFIED_RULES_ERROR)
}
