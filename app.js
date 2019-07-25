const stream = require('stream')
const mongoose = require('./mongoose')

const exportAPI = async (ctx) => {
  await new Promise(resolve => mongoose.once('open', () => resolve()))
  const resp = ctx.body = new stream.PassThrough() // 0.1ms
  exportCsv(resp).catch((err) => {
    console.error(err)
    // not care response
  })
}

async function exportCsv (resp) {
  while (true) {
    const conds = {}
    const invoices = await mongoose.db.collection('invoice').find(conds, {limit: 10}).toArray()
    console.log('read invoices', invoices.length)
    // const invoice = await invoiceCursor.next()
    if (!invoices.length) {
      resp.push(null) // response
      return
    }
    invoices.forEach((invoice) => {
      resp.push('invoice.id, invoice.price,' + invoice._id.toString()  + '\n')
    })
  }
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