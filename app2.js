const stream = require('stream')
const mongoose = require('./mongoose')

const exportAPI = async (ctx) => {
  await new Promise(resolve => mongoose.once('open', () => resolve()))
  const cursor = mongoose.db.collection('invoice').find(conds})
  const output = cursor.pipe(exportCsv())
  ctx.body = output
  ctx.set('downfiel', 'utf8: aaa.csv')

  // TODO: need error handle
  // cursor.on('error', (err) => {
  //   output.emit('error', err)
  // })
  // output.on('error', (err) => {
  //   console.log(err)
  //   // ctx.response.e()
  // })
  // return
  // ctx.body = await exportCsv({})
}

async function exportCsv (conds) {
  let isSentBom = false
  const readable = new stream.Transform({
    objectMode: true,
    transform (chunk, _, callback) {
      // send bom header
      // https://blog.csdn.net/xun_jing/article/details/81564710
      if (!isSentBom) {
        isSentBom = true
        // ef bb bfx
        this.push(Buffer.from(...))
      }
      // input
      // chunk = {key: value, key2: value2}
      const line = Object.keys(chunk).map(key => chunk[key]).join(',')
      
      // output
      // value,value2\n
      this.push(chunk + '\n')
    },
    flush(callback) {
      console.log('output stream end',)
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