import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

import './index.scss'
import { configureStore } from './store/configure-store'
import { Root } from './containers/root'
import { registerWorker } from './service-worker/register-worker'

registerWorker()
const store = configureStore()

moment.locale('fr')

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('cracra')
)
