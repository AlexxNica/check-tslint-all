import * as fs from 'fs'
import { flow } from 'lodash'
import { extname } from 'path'
import * as resolve from 'resolve'

const ARG1 = 2
const BUILT_IN_CONFIG = /^tslint:(.*)$/

export interface TSLintConfig {
  readonly extends?: string | string[],
  readonly rulesDirectory?: string | string[],
  readonly rules: { readonly [ruleName: string]: {} }
}

export function arrayize<T>(value?: T | T[]): T[] {
  if (value === undefined) return []
  if (Array.isArray(value)) return value
  return [value]
}

export function dashify(string: string): string {
    return string.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

export function getDirRules(dir: string): ReadonlyArray<string> {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir)
  .filter(file => /Rule.js$/.test(file))
  .map(file => file.substr(0, file.length - 'Rule.ts'.length))
}

export function getExtendRules(extend: string): ReadonlyArray<string> {
  const matches = extend.match(BUILT_IN_CONFIG)
  if (matches != null && matches.length > 0) return []

  return flow(
    () => resolve.sync(extend, { basedir: process.cwd() }),
    readConfigFile,
    config => config.rules,
    Object.keys,
  )()
}

export function log(output: string): void {
  if (process.argv[ARG1] === '--silent') return
  console.log(output)
}

export function readConfigFile(file: string): TSLintConfig {
  if (extname(file) === '.json') {
    return flow(
      () => fs.readFileSync(file).toString().replace(/^\uFEFF/, ''),
      stripComments,
      JSON.parse,
    )()
  } else {
    // tslint:disable-next-line:no-require-imports
    const config = require(file)
    delete require.cache[file]
    return config
  }
}

function stripComments(content: string): string {
  // tslint:disable-next-line:max-line-length
  const regexp: RegExp = /("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g
  const result = content.replace(regexp, (match, _m1: string, _m2: string, m3?: string, m4?: string) => {
      // Only one of m1, m2, m3, m4 matches
      if (m3 !== undefined) {
          // A block comment. Replace with nothing
          return ''
      } else if (m4 !== undefined) {
          // A line comment. If it ends in \r?\n then keep it.
          const length = m4.length
          // tslint:disable-next-line:no-magic-numbers
          if (length > 2 && m4[length - 1] === '\n') {
              // tslint:disable-next-line:no-magic-numbers
              return m4[length - 2] === '\r' ? '\r\n' : '\n'
          } else {
              return ''
          }
      } else {
          // We match a string
          return match
      }
  })
  return result
}
