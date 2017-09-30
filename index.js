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
  fs.readFile(path, 'utf-8').then(text => {
    let compiledText = compileString(text)
    let compFilename = path.replace(/\.\w+$, '.lua'/)
    f(compFilename, compiledText)
  })
}

const compileFileSyncWith = (path, f) => {
  let text = fs.readFileSync(path, 'utf-8')
  let compiledText = compileString(text)
  let compFilename = path.replace(/\.\w+$, '.lua'/)
  f(compFilename, compiledText)
}

const compileFileAsync = (path) => {
  compileFileAsyncWith(path, (compFilename, compiledText) => fs.writeFile(compFilename, compiledText))
}

const compileDirectorySync = (path) => {
  klawSync(path)
    .on('data', ({path, stats}) => compileFileSync(path))
}

const compileDirectorySyncWith = (path, f) => {
  klawSync(path)
    .on('data', ({path, stats}) => compileFileSyncWith(path, f))
}

const compileDirectoryAsync = (path) => {
  klaw(path)
    .on('data', ({path, stats}) => compileFileAsync(path))
}

const compileDirectoryAsyncWith = (path, f) => {
  klaw(path)
    .on('data', ({path, stats}) => compileFileAsyncWith(path, f))
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
