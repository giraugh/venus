const {parse} = require('./venparse.js')
const regexParse = require('./regexParser.js')
const reconstruct = require('./reconstruct.js')
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
  let text = fs.readFileSync(path, 'utf-8')
  let compiledText = compileString(text)
  let compFilename = path.replace(/\.\w+$, '.lua'/)
  fs.writeFileSync(compFilename, compiledText)
}

const compileFileAsync = (path) => {
  fs.readFile(path, 'utf-8').then(text => {
    let compiledText = compileString(text)
    let compFilename = path.replace(/\.\w+$, '.lua'/)
    return fs.writeFile(compFilename, compiledText)
  })
}

const compileDirectorySync = (path) => {
  klawSync(path)
    .on('data', ({path, stats}) => compileFileSync(path))
}

const compileDirectoryAsync = (path) => {
  klaw(path)
    .on('data', ({path, stats}) => compileFileSync(path))
}

module.exports = {
  compile: compileString,
  compileString,
  compileStringAsTree,
  compileFileSync,
  compileFileAsync,
  compileDirectorySync,
  compileDirectoryAsync
}
