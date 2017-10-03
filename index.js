const {parse} = require('./src/venparse.js')
const regexParse = require('./src/regexParser.js')
const reconstruct = require('./src/reconstruct.js')
const fs = require('fs-extra')
const klaw = require('klaw')
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

const getAstJSON = (str) => {
  // Pre-compile aliases
  let pre = regexParse(str)

  // Compile venus to make lua AST
  let ast = parse(pre)

  return JSON.stringify(ast, null, 4)
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
}

const compileFileSyncWith = (path, f) => {
  let text = fs.readFileSync(path, 'utf-8')
  let compiledText = compileString(text)
  let compFilename = path.replace(/\.\w+$/, '.lua')
  f(compFilename, compiledText)
}

const compileFileAsync = (path, error) => {
  return compileFileAsyncWith(path, (compFilename, compiledText) =>
    fs.writeFile(compFilename, compiledText)
    .catch(err => error ? error(err, path) : console.error(err))
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

const compileDirectoryAsync = (path, error) => {
  klaw(path)
    .on('data', ({path, stats}) => {
      if (isVenusFile(path, stats)) {
        console.log(path)
        compileFileAsync(path)
          .catch(err => error ? error(err, path) : console.error(err))
      }
    })
}

const compileDirectoryAsyncWith = (path, f, error) => {
  klaw(path)
    .on('data', ({path, stats}) => {
      if (isVenusFile(path, stats)) {
        compileFileAsyncWith(path, f)
          .catch(err => error ? error(err, path) : console.error(err))
      }
    })
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
  compileDirectoryAsyncWith,
  getAstJSON
}
