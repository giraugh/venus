const venus = require('./index.js')
venus.compileDirectoryAsync('./test')
  .catch(({error, path}) => console.error(error + ' in ' + path))
