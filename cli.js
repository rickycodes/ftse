const ftse = require('./')
const meow = require('meow')
const Table = require('cli-table')
const Spinner = require('cli-spinner').Spinner
const version = require('./package.json').version
const chalk = require('chalk')
const spinner = new Spinner(chalk.bold('processing... %s'))

const cli = meow({
  requireInput: false,
  help: [
    'Usage',
    '  ftse --market="market"',
    '  => `...`',
    '',
    '  ftse --version',
    '  => ' + version
  ].join('\n')
})

function format (arr) {
  const table = cli.flags.table || cli.flags.t
  if (table) {
    const ftseTable = new Table({
      head: ['name', 'change', 'change %', 'price']
    })

    arr.forEach(function (item) {
      const change_color = item.change_amount.indexOf('+') !== -1 ? chalk.green : chalk.red
      const change_percent = `(${item.change_percent})`
      ftseTable.push([
        chalk.bold(chalk.cyan(item.name)),
        change_color(item.change_amount),
        change_color(change_percent),
        chalk.bold(item.price)
      ])
    })

    return ftseTable.toString()
  } else {
    return arr.map(function (item) {
      const change_color = item.change_amount.indexOf('+') !== -1 ? chalk.green : chalk.red
      const change_percent = `(${item.change_percent})`
      return `${chalk.bold(chalk.cyan(item.name))} ${change_color(item.change_amount)} ${change_color(change_percent)} ${chalk.bold(item.price)}`
    }).join('\n')
  }
}

function log (items) {
  spinner.stop(true)
  console.log(format(items))
}

function output () {
  const market = cli.flags.market || cli.flags.m
  if (!market) return
  if (market) {
    spinner.start()
    const limit = cli.flags.limit || cli.flags.l || false
    const risers = cli.flags.risers || cli.flags.r
    const fallers = cli.flags.fallers || cli.flags.f
    const target = (function () {
      if (risers) return 'risers'
      if (fallers) return 'fallers'
    })()
    ftse(market, limit, target, log)
  }
}

output()
