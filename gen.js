const mongoose = require('./mongoose')

async function main () {
  await new Promise(resolve => mongoose.once('open', () => resolve()))
  while (true) {
    await mongoose.db.collection('invoice').insertOne({
      date: new Date()
    })
  }
}

main().then(() => {
  process.exit(0)
}).catch(e => {
  console.error(e)
  process.exit(1)
})
