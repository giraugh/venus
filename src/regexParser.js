module.exports = (a) => {
  a = a.replace(/{/g, ' { ')
  a = a.replace(/}/g, ' } ')
  a = a.replace(/fn/g, 'function')
  a = a.replace(/\(([^()[\]*+-]*)\)\s*=>\s*{/g, 'function ($1) {')
  a = a.replace(/!=/g, '~=')
  a = a.replace(/}\s*else\s*{/g, ' else ')
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9[\]]*)\s*\+=\s*([a-zA-Z_0-9.()[\]#]*)/g, '$1 = $1 + $2')
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9[\]]*)\s*-=\s*([a-zA-Z_0-9.()[\]#]*)/g, '$1 = $1 - $2')
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9[\]]*)\s*\*=\s*([a-zA-Z_0-9.()[\]#]*)/g, '$1 = $1 * $2')
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9[\]]*)\s*\/=\s*([a-zA-Z_0-9.()[\]#]*)/g, '$1 = $1 / $2')
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9[\]]*)\s*\.=\s*([a-zA-Z_0-9.()[\]#]*)/g, '$1 = $1 .. $2')
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9[\]]*)\s*\^=\s*([a-zA-Z_0-9.()[\]#]*)/g, '$1 = $1 ^ $2')
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9[\]]*)\s*\+\+/g, '$1 = $1 + 1')
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9[\]]*)\s*--/g, '$1 = $1 - 1')
  a = a.replace(
    /foreach\s+((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*),\s*((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s+in\s+((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)/g,
    'for $1, $2 in pairs($3)'
  )
  a = a.replace(/foreach\s+((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s+in\s+((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)/g, 'for _, $1 in pairs($2)')
  return a
}
