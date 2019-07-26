const stream = require('stream')
const mongoose = require('./mongoose')

const exportAPI = async (ctx) => {
  await new Promise(resolve => mongoose.once('open', () => resolve()))
  ctx.body = await exportCsv({})
}

async function exportCsv (conds) {
  // const conds = {}
  let skip = 0
  const limit = 10
  const readable = new stream.Readable({
    read () {
      ;(async () => {
        const invoices = await mongoose.db.collection('invoice').find(conds, {skip: skip, limit: limit}).toArray()
        if (!invoices.length) this.push(null)
        invoices.forEach(invoice => {
          const line = []
          Object.keys(invoice).forEach(key => line.push(invoice[key]))
          this.push(new Buffer(line.join(',') + '\n'))
        })
        skip += limit
      })().catch(err => {
        this.emit('error', err)
      })
      this.push()
    }
  })
  return readable
}

async function main () {
  const ctx = {
    set body (value) {
      const resp = new stream.PassThrough()
      resp.on('data', (chunk) => {
        console.log('csv data', chunk.toString())
      })
      value.pipe(resp)
    }
  }

  await exportAPI(ctx)
}

main().catch(e => {console.error(e)})