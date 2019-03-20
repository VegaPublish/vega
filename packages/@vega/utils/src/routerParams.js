export default {
  encode: function encode(params) {
    return Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join(';')
  },

  decode: function decode(str) {
    return str.split(';').reduce((params, pair) => {
      const [key, value] = pair.split('=')
      params[key] = decodeURIComponent(value)
      return params
    }, {})
  }
}
