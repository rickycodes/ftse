const cheerio = require('cheerio')
const http = require('http')
const chalk = require('chalk')

if(process.argv.length != 4) {
  console.log(chalk.red('Two arguments required!\nExample arguments: `aim risers`'))
  process.exit(1)
}

const kind = {
  '100': 'ftse-100/',
  'aim': 'ftse-aim-100/'
}

const url = 'http://www.hl.co.uk/shares/stock-market-summary/' + kind[process.argv[2]] + process.argv[3]

console.log(chalk.yellow('wait for it...'))

http.get(url, function(res) {
  var body = ''
  res.on('data', function (chunk) {
    body+= chunk
  }).on('end', function() {
    output(body)
  }).on('error', function(err) {
    console.log(e.message)
  })
})

function output(body) {
  const $ = cheerio.load(body)
  const $table = $('[summary="Market index"]')
  const items = []
  const up_down = (process.argv[3] === 'risers') ? '+' : '-'
  const highlight = (process.argv[3] === 'risers') ? chalk.green : chalk.red
  const amount = 5

  $table.find('tr').each(function(i, v) {
    if(i > 0) {
      items.push({
        name: $(this).find('td:nth-child(2)').text().replace(' plc', ' Plc'),
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
