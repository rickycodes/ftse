var cheerio = require('cheerio')
var http = require('http')
var chalk = require('chalk')

if(process.argv.length != 4) {
  console.log(chalk.red('Two arguments required!\nExample arguments: `aim risers`'))
  process.exit(1)
}

var kind = {
  '100': 'ftse-100/',
  'aim': 'ftse-aim-100/'
}

var url = 'http://www.hl.co.uk/shares/stock-market-summary/' + kind[process.argv[2]] + process.argv[3]
var items = []
var up_down = (process.argv[3] === 'risers') ? '+' : '-'
var highlight = (process.argv[3] === 'risers') ? chalk.green : chalk.red
var amount = 5

console.log(chalk.yellow('wait for it...'))

http.get(url, function(res) {
  var body = ''
  res.on('data', function (chunk) {
    body+= chunk
  })
  res.on('end', function() {
    output(body)
  })
})

function output(body) {
  var $ = cheerio.load(body)
  var $table = $('[summary="Market index"]')

  $table.find('tr').each(function(i, v) {
    if(i > 0) {
      items.push({
        name: $(this).find('td:nth-child(2)').text(),
        price: $(this).find('td:nth-child(3)').text(),
        change_amount: $(this).find('td:nth-child(4)').text(),
        change_percent: $(this).find('td:nth-child(5)').text().replace(up_down, '').replace('%', '')
      })
    }
  })

  items.sort(function(a, b) {
    return a.change_percent - b.change_percent
  }).reverse().slice(0, amount).forEach(function(v, i) {
    console.log(chalk.bold(chalk.cyan(v.name)) + ' ' + highlight(v.change_amount + ' (' + up_down + v.change_percent + '%) ') + chalk.bold(v.price))
  })
}
