function reportingFactory (path, options) {
  return [{
    module: 'good-squeeze',
    name: 'Squeeze',
    args: [options]
  }, {
    module: 'good-squeeze',
    name: 'SafeJson'
  }, {
    module: 'good-file',
    args: [path]
  }]
}

module.exports = {
  host: {
    port: process.env.PORT || 8001
  },
  logs: {
    reporters: {
      accessReporting: reportingFactory('./logs/hapi/hapi-out.log', { log: '*', response: '*' }),
      errorReporting: reportingFactory('./logs/hapi/hapi-error.log', { error: '*' }),
      workerReporting: reportingFactory('./logs/hapi/hapi-worker.log', { worker: '*' })
    }
  },
  lvconnect: {
    appId: process.env.LVCONNECT_APP_ID,
    appSecret: process.env.LVCONNECT_APP_SECRET,
    endpoint: 'https://lvconnect.herokuapp.com'
  }
}
