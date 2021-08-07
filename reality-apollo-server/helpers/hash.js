const readline = require('readline')
const { hashSync } = require('bcryptjs')

const getUserInput = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(resolve =>
    rl.question('Enter string to hash using bcryptjs: ', answer => {
      rl.close()
      resolve(answer)
    })
  )
}

getUserInput().then(input => {
  const hashedString = hashSync(input)
  console.log(`Resulting hash: ${hashedString}`)
})
