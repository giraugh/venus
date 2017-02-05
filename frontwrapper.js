module.exports.parse = function (a) {
  a = a.replace(/{/g, " { ")
  a = a.replace(/}/g, " } ")
  a = a.replace(/fn/g, "function")
  a = a.replace(/!=/, "~=")
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s*\+\=\s*([a-zA-Z_0-9.()\[\]\#]*)/, "$1 = $1 + $2")
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s*\-\=\s*([a-zA-Z_0-9.()\[\]\#]*)/, "$1 = $1 - $2")
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s*\*\=\s*([a-zA-Z_0-9.()\[\]\#]*)/, "$1 = $1 * $2")
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s*\/\=\s*([a-zA-Z_0-9.()\[\]\#]*)/, "$1 = $1 / $2")
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s*\.\=\s*([a-zA-Z_0-9.()\[\]\#]*)/, "$1 = $1 .. $2")
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s*\^\=\s*([a-zA-Z_0-9.()\[\]\#]*)/, "$1 = $1 ^ $2")
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s*\+\+/, "$1 = $1 + 1")
  a = a.replace(/((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s*\-\-/, "$1 = $1 - 1")
  a = a.replace(/foreach\s+((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)\s+in\s+((?:[a-zA-Z_]){1}[a-zA-Z_0-9]*)/, "for _, $1 in pairs($2)")
  return a
}
