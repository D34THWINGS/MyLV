const mongoose = require('mongoose')

mongoose.Promise = global.Promise

function mongodbSerializer (value, omit) {
  if (!value) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(v => mongodbSerializer(v, omit))
  }

  if (value.results && Array.isArray(value.results)) {
    return Object.assign({}, value, { results: value.results.map(v => mongodbSerializer(v, omit)) })
  }

  let payload = value
  if (value.toJSON) {
    payload = Object.assign(value.toJSON(), {
      id: value._id.toString()
    })
  } else if (value._id) {
    payload = Object.assign({}, value, {
      id: value._id
    })
  }

  omit.concat(['_id', '__v']).forEach((key) => {
    delete payload[key]
  })

  return payload
}

function mongodbReply (value, omit = []) {
  if (Promise.resolve(value) === value) {
    return this.response(value.then(payload => mongodbSerializer(payload, omit)))
  }
  return this.response(mongodbSerializer(value, omit))
}

exports.register = (server, { username, password, host, port, database, config }, next) => {
  server.decorate('reply', 'mongodb', mongodbReply)

  const userPart = username ? `${username}:${password}@` : ''
  mongoose.connect(`mongodb://${userPart}${host}:${port}/${database}`, config)
    .then(() => {
      server.on('stop', () => mongoose.disconnect())
      server.expose('mongoose', mongoose)
      next()
    })
    .catch(next)
}

exports.register.attributes = {
  name: 'mongodb',
  version: '0.0.1'
}
