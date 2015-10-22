const kind = {
  '100': 'ftse-100/',
  'aim': 'ftse-aim-100/'
}

const url = 'http://www.hl.co.uk/shares/stock-market-summary/' + kind[process.argv[2]] + process.argv[3]

console.log('target URL is: ' + url)
