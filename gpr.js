const fs = require('fs')

write({
  publishConfig: {
    registry: 'https://npm.pkg.github.com/@rollawaypoint'
  }
})

function write(options) {
  const data = fs.readFileSync('./package.json')

  var person = data.toString()

  person = JSON.parse(person)
  person = {
    ...person,
    ...options
  }

  fs.writeFileSync('./package.json', JSON.stringify(person))
}
