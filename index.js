var cheerio = require('cheerio')
var request = require('request')
var chalk = require('chalk')

if(!process.argv[2]) {
  console.log(chalk.red('need to pass an argument!'))
  process.exit(1)
}

if(process.argv[2] != 'risers' && process.argv[2] != 'fallers') {
  console.log(chalk.red('argument needs to be either: "risers" or "fallers"'))
  process.exit(1)
}

console.log('wait for it...')

request({
  uri: 'http://www.hl.co.uk/shares/stock-market-summary/ftse-100/' + process.argv[2]
}, function(err, res, body) {
  var $ = cheerio.load(body)
  var table = $('[summary="Market index"]')
  var items = []
  var up_down = (process.argv[2] === 'risers') ? '+' : '-'
  var amount = 5

  table.find('tr').each(function(i, v) {
    if(i > 0) {
      var obj = {}
      obj.name = $(this).find('td:nth-child(2)').text()
      obj.price = $(this).find('td:nth-child(3)').text()
      obj.change_amount = $(this).find('td:nth-child(4)').text()
      obj.change_percent = $(this).find('td:nth-child(5)').text().replace(up_down, '').replace('%', '')
      items.push(obj)
    }
  })

  items.sort(function(a, b) {
    return a.change_percent - b.change_percent
  }).reverse().slice(0, amount).forEach(function(v, i) {
    if(process.argv[2] === 'risers') {
      console.log(chalk.bold(chalk.cyan(v.name)) + ' ' + chalk.green(v.change_amount + ' (' + up_down + v.change_percent + '%) ') + chalk.bold(v.price))
    } else {
      console.log(chalk.bold(chalk.cyan(v.name)) + ' ' + chalk.red(v.change_amount + ' (' + up_down + v.change_percent + '%) ') + chalk.bold(v.price))
    }
  })
})
