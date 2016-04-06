const cheerio = require('cheerio')
const request = require('request')

module.exports = function (market, limit, target, cb) {
  const baseURL = 'http://www.hl.co.uk/shares/stock-market-summary/'
  const marketMap = {
    '100': 'ftse-100/',
    'aim': 'ftse-aim-100/'
  }

  const url = baseURL + marketMap[market] + (target || '')

  request({url: url}, function (error, response, body) {
    if (error) console.log(error)
    const $ = cheerio.load(body)
    const $table = $('[summary="Market index"]')
    const items = [].map.call($table.find('tr'), function (tr, i) {
      return {
        'name': $(tr).find('td:nth-child(2)').text().replace(' plc', ' Plc'),
        'price': $(tr).find('td:nth-child(3)').text(),
        'change_amount': $(tr).find('td:nth-child(4)').text(),
        'change_percent': $(tr).find('td:nth-child(5)').text()
      }
    })

    items.shift()

    cb((limit) ? items.slice(0, limit) : items)
  })
}
