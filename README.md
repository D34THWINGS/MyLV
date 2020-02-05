# [DEPRECATED] MyLV

[![CircleCI](https://circleci.com/gh/LinkValue/MyLV/tree/master.svg?style=svg&circle-token=e8c0d456e0c4d531addc26f22acdfddfc9713ec8)](https://circleci.com/gh/LinkValue/MyLV)
[![Staging shield](https://img.shields.io/website/https/cracra-staging.herokuapp.com.svg?label=staging&logo=heroku)](https://cracra-staging.herokuapp.com)
[![Production shield](https://img.shields.io/website/https/cracra.herokuapp.com.svg?label=production&logo=heroku)](https://my.link-value.fr)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

⚠️ **This project is no longer maintained** ⚠️

Timesheets editor, vacations manager and transport receipts upload for LinkValue built with React, Redux and HapiJS.
The objective of this project is to be able to fill out your timesheets/vacations within 10 seconds without effort.

## Installation

Before anything, be sure to have Node 10.14.x at least installed.
Also MongoDB >3.6.x is required if you don't use Docker.

If you don't want to use production authentication service ([LinkValue](https://lvconnect.link-value.fr))
create a local configuration file under `config/local.{js,json}` containing the following fields:

```json
{
  "lvconnect": {
    "appId": "LvConnect app id used for login",
    "appSecret": "LvConnect app secret used for login"
  }
}
```

This file can override any fields contained in other configuration files. More information about configuration
[here](https://www.npmjs.com/package/config).

Next, you'll have to install the dependencies by running:

```
yarn
```

To build the frontend application for production use, you'll have to run:

```
yarn build
```

Finally, to start the application in production environment:

```
APP_ENV=production node .
```

## Development

You can run the server and its database in a docker by running :

```
docker-compose up
```

Note : You will need to update/create the configuration file `config/local.js` to run node on correct host.

```
module.exports = {
  host: {
    hostname: '0.0.0.0',
  },
  lvconnect: {
    appId: '731c8e87-xxxx-xxxx-xxxx-xxxxxxxxxxx',
    appSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    endpoint: 'https://lvconnect.link-value.fr', // use lvconnect prod
  },
  mongodb: {
    host: 'db', // http://db is the docker address in the default network
    port: 27017,
    database: 'cracra',
    config: {
      useMongoClient: true,
    },
  },
}
```



## Contributing

This project uses ESLint to check code style and uses the AirBnB configuration without semicolons.
We recommend the usage of a plugin for your IDE to enable lint inside it. At this moment the project is lacking unit
testing and feature testing which opens a window for regressions so be careful.

To start the frontend watch mode build, run:

```
yarn dev:front
```

And for the backend watch mode, run:

```
yarn dev:back
```

## Licence

Copyright (c) 2016 LinkValue

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

