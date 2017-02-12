parser = require("./venparse.js")
fparser = require("./frontwrapper.js")
fs = require('fs')

//Fwrapper, Parser and recompiler
go = function(x) {
    pre = fparser.parse(x)
    ast = parser.parse(pre)
    c = recompile(ast)
    if (process.argv[3] === "ast") {
      return JSON.stringify(ast, null, 4)
    }
    return c
}

//Turn AST into Code
recompile = function(ast) {
  code = ""
  level = 0

  body = function(x, i) {
    if (i == 0) code += "\n"
    rnode(x)
    code += "\n"
  }

  bodynr = function(x, i) {
    rnode(x)
    code += "\n"
  }

  inset = function() {
    code += "\t".repeat(level)
  }

  write = function(x) {
    inset()
    code += x
  }

  rnode = function(x) {
    if (x.type == "Chunk") {
      x.body.forEach(bodynr)
    }

    if (x.type == "FunctionDeclaration") {
      write("function ")
      if (x.identifier) {
        rnode(x.identifier)
      }

      //Arguments
      code += '('
      x.parameters.forEach(function(par, i) {
        rnode(par)
        if (i != x.parameters.length-1) code += ", "
      })
      code += ')'

      //Body
      code += " "
      level += 1
      x.body.forEach(body)
      level -= 1
      write("end")
    }

    if (x.type == "IfStatement") {
      write("if ")

      //Clauses
      x.clauses.forEach(rnode)

      //end
      level -= 1
      write("end")
    }

    if (x.type == "ReturnStatement") {
      write("return ")
      x.arguments.forEach(rnode)
    }

    if (x.type == "CallStatement") {
      inset()
      rnode(x.expression)
    }

    if (x.type == "WhileStatement") {
        write("while ")

        //Condition
        code += '('
        rnode(x.condition)
        code += ')'

        //Body
        code += " do "
        level += 1
        x.body.forEach(body)
        level -= 1
        write("end")
    }

    if (x.type == "AssignmentStatement") {
      //Variables
      inset()
      x.variables.forEach(function(par, i) {
        rnode(par)
        if (i != x.variables.length-1) code += ", "
      })

      //middle
      code += " = "

      //Init
      x.init.forEach(function(par, i) {
        rnode(par)
        if (i != x.init.length-1) code += ", "
      })

    }

    if (x.type == "LocalStatement") {
      write("local ")

      //Variables
      x.variables.forEach(function(par, i) {
        rnode(par)
        if (i != x.variables.length-1) code += ", "
      })

      //middle
      code += " = "

      //Init
      x.init.forEach(function(par, i) {
        rnode(par)
        if (i != x.init.length-1) code += ", "
      })

    }

    if (x.type == "ForNumericStatement") {
      write("for ")

      //variable
      rnode(x.variable)
      code += " = "

      //start
      rnode(x.start)
      code += ", "

      //end
      rnode(x.end)

      //step
      if (x.step) {
        code += ", "
        rnode(x.step)
      }

      //body
      code += " do "
      level += 1
      x.body.forEach(body)
      level -= 1
      write(end)
    }

    if (x.type == "ForGenericStatement") {
      write("for ")

      //variables
      x.variables.forEach(function(par, i) {
        rnode(par)
        if (i != x.variables.length-1) code += ", "
      })

      //middle
      code += " in "

      //iterators
      x.iterators.forEach(function(par, i) {
        rnode(par)
        if (i != x.iterators.length-1) code += ", "
      })

      //body
      code += " do "
      level += 1
      x.body.forEach(body)
      level -= 1
      write(end)
    }

    if (x.type == "LabelStatement") {
      inset()
      code += "::"
      rnode(x.label)
      code += "::"
    }

    if (x.type == "GotoStatement") {
      write("goto ")
      rnode(x.label)
    }

    if (x.type == "BreakStatement") {
      write("break ")
    }

    if (x.type == "DoStatement") {
      write("do ")
      level += 1
      x.body.forEach(body)
      level -= 1
      write(end)
    }

    if (x.type == "RepeatStatement") {
      write("repeat ")
      level +=1

      //body
      x.body.forEach(body)

      //until
      level -= 1
      write("until (")
      rnode(x.condition)
      code += ")"
    }

    if (x.type == "IfClause") {
      //Condition
      code += '('
      rnode(x.condition)
      code += ')'

      //Body
      code += " then "
      level += 1
      x.body.forEach(body)
    }

    if (x.type == "ElseClause") {
      //body
      code += " else "
      level += 1
      x.body.forEach(body)
    }

    if (x.type == "ElseifClause") {
      code += " elseif "

      //Condition
      code += '('
      rnode(x.condition)
      code += ')'

      //Body
      code += " then "
      level += 1
      x.body.forEach(body)
    }

    if (x.type == "Identifier") {
      code += x.name
    }

    if (x.type == "StringLiteral") {
      code += x.raw
    }

    if (x.type == "NumericLiteral") {
      code += x.raw
    }

    if (x.type == "BinaryExpression") {
      if (x.inParens) code += "("
      rnode(x.left)
      code += " " + x.operator + " "
      rnode(x.right)
      if (x.inParens) code += ")"
    }

    if (x.type == "LogicalExpression") {
      if (x.inParens) code += "("
      rnode(x.left)
      code += " " + x.operator + " "
      rnode(x.right)
      if (x.inParens) code += ")"
    }

    if (x.type == "CallExpression") {
      //base
      rnode(x.base)

      //arguments
      code += '('
      x.arguments.forEach(function(par, i) {
        rnode(par)
        if (i != x.arguments.length-1) code += ", "
      })
      code += ')'
    }

    if (x.type == "IndexExpression") {
      rnode(x.base)
      code += "["
      rnode(x.index)
      code += "]"
    }

    if (x.type == "TableConstructorExpression") {
      code += "{"
      x.fields.forEach((f, i)=>{
        rnode(f)
        if (i != x.fields.length-1) code += ", "
      })
      code += "}"
    }

    if (x.type == "TableKeyString") {
      rnode(x.key)
      code += " = "
      rnode(x.value)
    }

    if (x.type == "TableValue") {
      rnode(x.value)
    }

    if (x.type == "TableKey") {
      code += "["
      rnode(x.key)
      code += "] = "
      rnode(x.value)
    }

  }

  //Recompile from the root node
  rnode(ast)

  return code
}

//Read-Eval-Print Loop
repl = function() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdout.write("\nVenus>");
  process.stdin.on('data', function (text) {
    if (/(ast)\n?\r?/.test(text)) {
      process.argv[3] = "ast"
      console.log(">Displaying AST")
      process.stdout.write("\nVenus>");
      return
    }
    if (/(code)\n?\r?/.test(text)) {
      process.argv[3] = ""
      console.log(">Displaying CODE")
      process.stdout.write("\nVenus>");
      return
    }
    if (/(quit|exit|close)\n?\r?/.test(text)) {
      process.exit();
    }
    console.log(">" + go(text))
    process.stdout.write("Venus>");
  });
}

gofile = function(path) {
  //read the file
  c = fs.readFileSync(path, 'utf-8')

  //parse
  c = go(c)

  //name?
  fn = path.replace(/\.\w+$/, ".lua")

  //write
  fs.writeFileSync(fn, c)
}

godir = function(path) {
  files = fs.readdirSync(path)
  files.forEach(function(p) {
    if (/\.(ven|venus|vns)$/.test(p)) gofile(p)
  })
}

//store command shorthand
c = process.argv[2]

//Do we want the REPL?
if (c == undefined || c == " ") {
  repl()
} else {
  //Is it a path?
  if (fs.existsSync(c)) {
    s = fs.statSync(c)
    //File?
    if (s.isFile()) {
      gofile(c)
      process.exit()
    }

    //Directory?
    if (s.isDirectory()) {
      godir(c)
      process.exit()
    }
  }

  //Lets assume it is a string
  console.log(go(c))
}
