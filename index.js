var cheerio = require('cheerio')
var request = require('request')
var chalk = require('chalk')

if(process.argv.length != 4) {
  console.log(chalk.red('two arguments required!\neg: `node index.js ftse risers`'))
  process.exit(1)
}

var kind = {
  'ftse': 'ftse-100/',
  'aim': 'ftse-aim-100/'
}

console.log(chalk.yellow('wait for it...'))

request({
  uri: 'http://www.hl.co.uk/shares/stock-market-summary/' + kind[process.argv[2]] + process.argv[3]
}, function(err, res, body) {
  var $ = cheerio.load(body)
  var table = $('[summary="Market index"]')
  var items = []
  var up_down = (process.argv[3] === 'risers') ? '+' : '-'
  var highlight = (process.argv[3] === 'risers') ? chalk.green : chalk.red
  var amount = 5

  table.find('tr').each(function(i, v) {
    if(i > 0) {
      var obj = {
        name: $(this).find('td:nth-child(2)').text(),
        price: $(this).find('td:nth-child(3)').text(),
        change_amount: $(this).find('td:nth-child(4)').text(),
        change_percent: $(this).find('td:nth-child(5)').text().replace(up_down, '').replace('%', '')
      }
      items.push(obj)
    }
  })

  items.sort(function(a, b) {
    return a.change_percent - b.change_percent
  }).reverse().slice(0, amount).forEach(function(v, i) {
    console.log(chalk.bold(chalk.cyan(v.name)) + ' ' + highlight(v.change_amount + ' (' + up_down + v.change_percent + '%) ') + chalk.bold(v.price))
  })
})
