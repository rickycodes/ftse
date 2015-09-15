const http = require('http')
const request = http.get('http://www.hl.co.uk/shares/stock-market-summary/ftse-100/risers', function (res) {
  var body = ''
  res.on('data', function (chunk) {
    body+= chunk
  }).on('error', function (err) {
    console.log(err.message)
  }).on('end', function () {
    console.log(body)
  })
}).end()
