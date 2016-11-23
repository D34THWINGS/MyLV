import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link, IndexLink } from 'react-router'

import styles from './app-drawer.scss'

const mapStateToProps = ({ user }) => ({
  canPrint: user.firstName && user.lastName && user.clientName && user.clientAddress
})

const AppDrawer = ({ canPrint }) => (
  <div className={classNames('mdl-layout__drawer', styles.printHide)}>
    <span className='mdl-layout-title'>CraCra</span>
    <nav className='mdl-navigation'>
      <Link className='mdl-navigation__link' to='/user'>Partner / client</Link>
      {canPrint ? <IndexLink className='mdl-navigation__link' to='/'>Remplir son CRA</IndexLink> : null}
    </nav>
  </div>
)

export default connect(mapStateToProps)(AppDrawer)