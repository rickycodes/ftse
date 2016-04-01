#!/usr/bin/env node

const ftse = require('./')
const meow = require('meow')
const bold = require('chalk').bold
const format = require('./format.js')
const spinner = require('ora')({
  color: 'white',
  text: 'processing',
  spinner: 'line'
})
const cli = meow({
  requireInput: false,
  help: require('./help')()
})

function log (items) {
  spinner.stop()
  const table = cli.flags.table || cli.flags.t
  const out = (table) ? format.table(items) : format.normal(items)
  console.log(out || bold('no results!'))
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
