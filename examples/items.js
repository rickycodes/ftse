const cheerio = require('cheerio')
const http = require('http')

const kind = {
  '100': 'ftse-100/',
  'aim': 'ftse-aim-100/'
}

const url = 'http://www.hl.co.uk/shares/stock-market-summary/' + kind[process.argv[2]] + process.argv[3]

http.get(url, function (res) {
  var body = ''
  res.on('data', function (chunk) {
    body += chunk
  }).on('error', function (err) {
    console.log(err.message)
  }).on('end', function () {
    output(body)
  })
}).end()

function output (body) {
  const $ = cheerio.load(body)
  const $table = $('[summary="Market index"]')
  const items = []

  $table.find('tr').each(function (i, v) {
    if (i > 0) {
      items.push({
        name: $(this).find('td:nth-child(2)').text(),
        price: $(this).find('td:nth-child(3)').text(),
        change_amount: $(this).find('td:nth-child(4)').text(),
        change_percent: $(this).find('td:nth-child(5)').text()
      })
    }
  })

  console.dir(items)
}
