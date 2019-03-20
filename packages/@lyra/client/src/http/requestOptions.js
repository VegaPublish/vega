const projectHeader = 'X-Lyra-Project-ID'

module.exports = config => {
  const headers = {}

  if (config.token) {
    headers.Authorization = `Bearer ${config.token}`
  }

  return {
    headers: headers,
    timeout: 'timeout' in config ? config.timeout : 30000,
    json: true,
    withCredentials: Boolean(config.token || config.withCredentials)
  }
}
