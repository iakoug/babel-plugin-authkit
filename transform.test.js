const babel = require('babel-core')

const code = `
import All from 'anySpecPackageName'

console.log(All.test())
`

// npm link
// npm link babel-plugin-authkit
const AST = babel.transform(code, {
  plugins: [
    [
      'authkit',
      {
        lib: 'anySpecPackageName'
      }
    ]
  ]
})

console.log(AST.code)
