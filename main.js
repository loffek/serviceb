const PORT = process.env.PORT
const SERVICE_A_URL = process.env.SERVICE_A_URL
const SERVICE_A_PORT = process.env.SERVICE_A_PORT
const net = require('net')
const http = require('http')

const handler = (req, res) => {
  if (req.method === 'POST' && req.url === '/relay') {
    const bodyBuffer = []
    req.on('error', err => {
      req.statusCode = 500
      req.end()
    })
    req.on('data', chunk => bodyBuffer.push(chunk))
    req.on('end', () => {
      const body = Buffer.concat(bodyBuffer).toString()
      const client = new net.Socket()
      client.connect(SERVICE_A_PORT, SERVICE_A_URL, () => {
        client.write(body)
      })
      client.on('data', chunk => {
        res.write(`${chunk} `)
        client.destroy()
      })
      client.on('close', () => {
        res.statusCode = 200
        res.end()
      })
      client.on('error', err => {
        res.statusCode = 500
        res.end()
      })
    })
  } else if (req.method === 'GET' && req.url === '/health') {
    res.statusCode = 200
    res.end()
  } else {
    res.statusCode = 404
    res.end()
  }
}

//create a server object:
http.createServer(handler).listen(PORT)
console.log(`serviceb listening on port ${PORT}`)
