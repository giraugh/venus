/*
  Accepts an abstract syntax tree and returns the equivalent lua code.
*/
module.exports = (ast) => {
  let code = ''
  let level = 0

  const body = (x, i) => {
    if (i === 0) code += '\n'
    rnode(x)
    code += '\n'
  }

  const bodynr = (x, i) => {
    rnode(x)
    code += '\n'
  }

  const inset = () => {
    code += '\t'.repeat(level)
  }

  const write = (x) => {
    inset()
    code += x
  }

  const rnode = (x) => {
    if (x.type === 'Chunk') {
      x.body.forEach(bodynr)
    }

    if (x.type === 'FunctionDeclaration') {
      write('function ')
      if (x.identifier) {
        rnode(x.identifier)
      }

      // Arguments
      code += '('
      x.parameters.forEach((par, i) => {
        rnode(par)
        if (i !== x.parameters.length - 1) code += ', '
      })
      code += ')'

      // Body
      code += ' '
      level += 1
      x.body.forEach(body)
      level -= 1
      write('end')
    }

    if (x.type === 'IfStatement') {
      write('if ')

      // Clauses
      x.clauses.forEach(rnode)

      // end
      level -= 1
      write('end')
    }

    if (x.type === 'ReturnStatement') {
      write('return ')
      x.arguments.forEach((par, i) => {
        rnode(par)
        if (i !== x.arguments.length - 1) code += ', '
      })
    }

    if (x.type === 'CallStatement') {
      inset()
      rnode(x.expression)
    }

    if (x.type === 'WhileStatement') {
      write('while ')

        // Condition
      code += '('
      rnode(x.condition)
      code += ')'

        // Body
      code += ' do '
      level += 1
      x.body.forEach(body)
      level -= 1
      write('end')
    }

    if (x.type === 'AssignmentStatement') {
      // Variables
      inset()
      x.variables.forEach((par, i) => {
        rnode(par)
        if (i !== x.variables.length - 1) code += ', '
      })

      // middle
      code += ' = '

      // Init
      x.init.forEach((par, i) => {
        rnode(par)
        if (i !== x.init.length - 1) code += ', '
      })
    }

    if (x.type === 'LocalStatement') {
      write('local ')

      // Variables
      x.variables.forEach((par, i) => {
        rnode(par)
        if (i !== x.variables.length - 1) code += ', '
      })

      // middle
      if (x.init.length) {
        code += ' = '
      }

      // Init
      x.init.forEach((par, i) => {
        rnode(par)
        if (i !== x.init.length - 1) code += ', '
      })
    }

    if (x.type === 'ForNumericStatement') {
      write('for ')

      // variable
      rnode(x.variable)
      code += ' = '

      // start
      rnode(x.start)
      code += ', '

      // end
      rnode(x.end)

      // step
      if (x.step) {
        code += ', '
        rnode(x.step)
      }

      // body
      code += ' do '
      level += 1
      x.body.forEach(body)
      level -= 1
      write('end')
    }

    if (x.type === 'ForGenericStatement') {
      write('for ')

      // variables
      x.variables.forEach((par, i) => {
        rnode(par)
        if (i !== x.variables.length - 1) code += ', '
      })

      // middle
      code += ' in '

      // iterators
      x.iterators.forEach((par, i) => {
        rnode(par)
        if (i !== x.iterators.length - 1) code += ', '
      })

      // body
      code += ' do '
      level += 1
      x.body.forEach(body)
      level -= 1
      write('end')
    }

    if (x.type === 'LabelStatement') {
      inset()
      code += '::'
      rnode(x.label)
      code += '::'
    }

    if (x.type === 'GotoStatement') {
      write('goto ')
      rnode(x.label)
    }

    if (x.type === 'BreakStatement') {
      write('break ')
    }

    if (x.type === 'DoStatement') {
      write('do ')
      level += 1
      x.body.forEach(body)
      level -= 1
      write('end')
    }

    if (x.type === 'RepeatStatement') {
      write('repeat ')
      level += 1

      // body
      x.body.forEach(body)

      // until
      level -= 1
      write('until (')
      rnode(x.condition)
      code += ')'
    }

    if (x.type === 'IfClause') {
      // Condition
      code += '('
      rnode(x.condition)
      code += ')'

      // Body
      code += ' then '
      level += 1
      x.body.forEach(body)
    }

    if (x.type === 'ElseClause') {
      // body
      code += ' else '
      level += 1
      x.body.forEach(body)
    }

    if (x.type === 'ElseifClause') {
      code += ' elseif '

      // Condition
      code += '('
      rnode(x.condition)
      code += ')'

      // Body
      code += ' then '
      level += 1
      x.body.forEach(body)
    }

    if (x.type === 'Identifier') {
      code += x.name
    }

    if (x.type === 'StringLiteral') {
      code += x.raw
    }

    if (x.type === 'VarargLiteral') {
      code += x.raw
    }

    if (x.type === 'NilLiteral') {
      code += x.raw
    }

    if (x.type === 'NumericLiteral') {
      code += x.raw
    }

    if (x.type === 'BooleanLiteral') {
      code += x.raw
    }

    if (x.type === 'MemberExpression') {
      rnode(x.base)
      code += x.indexer
      rnode(x.identifier)
    }

    if (x.type === 'BinaryExpression') {
      if (x.inParens) code += '('
      rnode(x.left)
      code += ' ' + x.operator + ' '
      rnode(x.right)
      if (x.inParens) code += ')'
    }

    if (x.type === 'UnaryExpression') {
      if (x.inParens) code += '('
      code += ' ' + x.operator + ' '
      rnode(x.argument)
      if (x.inParens) code += ')'
    }

    if (x.type === 'LogicalExpression') {
      if (x.inParens) code += '('
      rnode(x.left)
      code += ' ' + x.operator + ' '
      rnode(x.right)
      if (x.inParens) code += ')'
    }

    if (x.type === 'CallExpression') {
      // base
      rnode(x.base)

      // arguments
      code += '('
      x.arguments.forEach((par, i) => {
        rnode(par)
        if (i !== x.arguments.length - 1) code += ', '
      })
      code += ')'
    }

    if (x.type === 'StringCallExpression') {
      // base
      rnode(x.base)

      // arguments
      code += '('
      rnode(x.argument)
      code += ')'
    }

    if (x.type === 'IndexExpression') {
      rnode(x.base)
      code += '['
      rnode(x.index)
      code += ']'
    }

    if (x.type === 'TableConstructorExpression') {
      code += '{'
      x.fields.forEach((f, i) => {
        rnode(f)
        if (i !== x.fields.length - 1) code += ', '
      })
      code += '}'
    }

    if (x.type === 'TableKeyString') {
      rnode(x.key)
      code += ' = '
      rnode(x.value)
    }

    if (x.type === 'TableValue') {
      rnode(x.value)
    }

    if (x.type === 'TableKey') {
      code += '['
      rnode(x.key)
      code += '] = '
      rnode(x.value)
    }
  }

  // Recompile from the root node
  rnode(ast)

  return code
}
