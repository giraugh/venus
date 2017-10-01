const {parse} = require('./src/venparse.js')
const regexParse = require('./src/regexParser.js')
const reconstruct = require('./src/reconstruct.js')
const fs = require('fs-extra')
const klaw = require('klaw')
const klawSync = require('klaw-sync')

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
    let compiledText = compileString(text)
    let compFilename = path.replace(/\.\w+$/, '.lua')
    f(compFilename, compiledText)
  })
  .catch(err => { throw err })
}

const compileFileSyncWith = (path, f) => {
  let text = fs.readFileSync(path, 'utf-8')
  let compiledText = compileString(text)
  let compFilename = path.replace(/\.\w+$/, '.lua')
  f(compFilename, compiledText)
}

const compileFileAsync = (path) => {
  return compileFileAsyncWith(path, (compFilename, compiledText) =>
    fs.writeFile(compFilename, compiledText)
    .catch(err => { throw err })
  )
}

const compileDirectorySync = (path) => {
  let files = klawSync(path)
  files.forEach((path) =>
    compileFileSync(path)
  )
}

const compileDirectorySyncWith = (path, f) => {
  let files = klawSync(path)
  files.forEach((path) =>
    compileFileSyncWith(path, f)
  )
}

const isVenusFile = (path, stats) => {
  if (!stats.isDirectory()) { return false }
  return path.replace(/\.\w+$/, '.venus') === path
}

const compileDirectoryAsync = (path) => {
  klaw(path)
    .on('data', ({path, stats}) => isVenusFile(path, stats) ? null : compileFileAsync(path))
}

const compileDirectoryAsyncWith = (path, f) => {
  klaw(path)
    .on('data', ({path, stats}) => isVenusFile(path, stats) ? null : compileFileAsyncWith(path, f))
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
