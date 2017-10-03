const {parse} = require('./src/venparse.js')
const regexParse = require('./src/regexParser.js')
const reconstruct = require('./src/reconstruct.js')
const fs = require('fs-extra')
const klawSync = require('klaw-sync')
const {extname} = require('path')

const compileString = (str) => {
  // Pre-compile aliases
  let pre = regexParse(str)

  // Compile venus to make lua AST
  let ast = parse(pre)

  // Reconstruct AST into lua
  return reconstruct(ast)
}

const compileStringAsTree = (str) => {
  // Pre-compile aliases
  let pre = regexParse(str)

  // Compile venus to make lua AST
  return parse(pre)
}

const compileFileSync = (path) => {
  compileFileSyncWith(path, (compFilename, compiledText) => fs.writeFileSync(compFilename, compiledText))
}

const compileFileAsyncWith = (path, f) => {
  return fs.readFile(path, 'utf-8').then(text => {
    let compiledText
    try {
      compiledText = compileString(text)
    } catch (e) {
      let err = {
        error: e,
        path
      }
      throw err
    }
    let compFilename = path.replace(/\.\w+$/, '.lua')
    f(compFilename, compiledText)
  })
}

const compileFileSyncWith = (path, f) => {
  let text = fs.readFileSync(path, 'utf-8')
  let compiledText
  try {
    compiledText = compileString(text)
  } catch (e) {
    let err = {
      error: e,
      path
    }
    throw err
  }
  let compFilename = path.replace(/\.\w+$/, '.lua')
  f(compFilename, compiledText)
}

const compileFileAsync = (path) => {
  return compileFileAsyncWith(path, (compFilename, compiledText) =>
    fs.writeFile(compFilename, compiledText)
  )
}

const isVenusFile = (path, stats) => {
  if (stats.isDirectory()) { return false }
  return extname(path) === '.venus'
}

const compileDirectorySync = (path) => {
  let files = klawSync(path, {nodir: true})
  files.filter(
    ({path, stats}) => isVenusFile(path, stats)
  ).forEach(({path, stats}) =>
    compileFileSync(path)
  )
}

const compileDirectorySyncWith = (path, f) => {
  let files = klawSync(path, {nodir: true})
  files.filter(
    ({path, stats}) => isVenusFile(path, stats)
  ).forEach(({path, stats}) =>
    compileFileSyncWith(path, f)
  )
}

const compileDirectoryAsync = (path) => {
  let files = klawSync(path, {nodir: true})
  return Promise.all(
      files.filter(
      ({path, stats}) => isVenusFile(path, stats)
    ).map(({path, stats}) =>
      compileFileAsync(path)
    )
  )
}

const compileDirectoryAsyncWith = (path, f) => {
  let files = klawSync(path, {nodir: true})
  return Promise.all(
      files.filter(
      ({path, stats}) => isVenusFile(path, stats)
    ).map(({path, stats}) =>
      compileFileAsyncWith(path, f)
    )
  )
}

module.exports = {
  compile: compileString,
  compileString,
  compileStringAsTree,
  compileFileSync,
  compileFileSyncWith,
  compileFileAsync,
  compileFileAsyncWith,
  compileDirectorySync,
  compileDirectorySyncWith,
  compileDirectoryAsync,
  compileDirectoryAsyncWith
}
