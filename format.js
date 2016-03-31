const Table = require('cli-table')
const chalk = require('chalk')

function getChangeColor (item) {
  return item.change_amount.indexOf('+') !== -1 ? chalk.green : chalk.red
}

exports.table = function (arr) {
  const ftseTable = new Table({
    head: [
      chalk.bold('Name'),
      chalk.bold('Change'),
      chalk.bold('Change %'),
      chalk.bold('Price (p)')
    ]
  })

  arr.forEach(function (item) {
    const change_color = getChangeColor(item)
    const change_percent = `(${item.change_percent})`
    ftseTable.push([
      chalk.bold(chalk.cyan(item.name)),
      change_color(item.change_amount),
      change_color(change_percent),
      chalk.bold(item.price)
    ])
  })

  return ftseTable.toString()
}

exports.normal = function (arr) {
  return arr.map(function (item) {
    const change_color = getChangeColor(item)
    const change_percent = `(${item.change_percent})`
    return `${chalk.bold(chalk.cyan(item.name))} ${change_color(item.change_amount)} ${change_color(change_percent)} ${chalk.bold(item.price)}`
  }).join('\n')
}
