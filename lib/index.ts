import * as fs from 'fs'
import { chain, difference } from 'lodash'
import {
  arrayize,
  dashify,
  getDirRules,
  getExtendRules,
  readConfigFile,
  TSLintConfig,
} from './helpers'

if (!fs.existsSync('tslint.json')) {
  console.error('Missing tslint.json')
  process.exit(-1)
}
if (!fs.existsSync('node_modules')) {
  console.error(`Missing node_modules`)
  process.exit(-1)
}

const TSLINT_RULE_DIRECTORY = 'node_modules/tslint/lib/rules'

const mainConfig: TSLintConfig = readConfigFile('tslint.json')

const myRules = Object.keys(mainConfig.rules)

const dirRules = chain(arrayize(mainConfig.rulesDirectory).concat(TSLINT_RULE_DIRECTORY))
.map(getDirRules)
.flatten()
.map(dashify)
.value()

const extendRules = chain(arrayize(mainConfig.extends))
.map(getExtendRules)
.flatten()
.value()

const allRules = chain(dirRules).concat(extendRules).uniq().value()

console.log('Unspecified rules in tslint.json')
console.log('================================')
difference(allRules, myRules).forEach(item => console.log(item))
