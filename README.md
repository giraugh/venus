![Venus Logo][logo]
# Venus
___A 'go' like language that compiles into lua.___
It uses a modified copy of the ['luaparse'](https://oxyc.github.io/luaparse/) library to create an
ast before recompiling into lua.

### Language Features
  - Curly Brace Syntax (instead of `then` and `end`)
  - `foreach` keyword for iterating on objects
  - `+=`, `-=`, `*=`, `/=`, `^=`, `.=`, `++` and `--` operators
  - `fn` instead of `function` (allows better functional programming)

### Language Features to come
  - lambda functions (like arrow functions in js)
  - support for `[+]` and `[##+1]` style table accesors.
  - switch statement (using `goto` keyword)


### Compiler Features
  - Compiler REPL
  - Compile Single File
  - Compile all files in Directory
  - Pass string

### License
Licensed under [The MIT license](https://opensource.org/licenses/MIT)

[logo]: icon.png
