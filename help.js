const bold = require('chalk').bold
const version = require('./package.json').version

module.exports = function () {
  return [
    'The following options are available:',
    '',
    `--${bold('market')}=market -${bold('m')}=market`,
    '   Specify which market, either `aim` or `100` (ftse-100)',
    '',
    `--${bold('limit')}=num -${bold('l')}=num`,
    '   Limit the results to a specific number',
    '',
    `--${bold('risers')} -${bold('r')}`,
    '   Limit the results to risers only',
    '',
    `--${bold('fallers')} -${bold('f')}`,
    '   Limit the results to fallers only',
    '',
    `--${bold('table')} -${bold('t')}`,
    '   Render output as table',
    '',
    bold('USAGE'),
    '  ftse --market=100',
    '  => `...`',
    '',
    '  ftse --market=aim --limit=5',
    '  => `...`',
    '',
    '  ftse --market=aim --limit=5 --risers',
    '  => `...`',
    '',
    '  ftse --market=aim --limit=10 --fallers',
    '  => `...`',
    '',
    '  ftse --version',
    '  => ' + version
  ].join('\n')
}
