const ObjectHash = require('object-hash')

class Functions {

  static formatMoney(n, c, d, t) {
      var c = isNaN((c = Math.abs(c))) ? 2 : c,
        d = d == undefined ? '.' : d,
        t = t == undefined ? ',' : t,
        s = n < 0 ? '-' : '',
        i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
        j = (j = i.length) > 3 ? j % 3 : 0

      return (
        s +
        (j ? i.substr(0, j) + t : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
        (c
          ? d +
            Math.abs(n - i)
              .toFixed(c)
              .slice(2)
          : '')
      )
        .replace(',', '')
        .replace('.', ',')
  }

  static generateNumbers(range) {
    let pwd = ''
    for (let i = 0; i < range; i++) {
        pwd += Math.floor(Math.random() * 10).toString()
    }
    return pwd
  }

  static generateMd5 (value) {
    return ObjectHash.MD5(value)
  }

  static generateSha1 (value) {
    return ObjectHash.sha1(value)
  }
}

module.exports = Functions;