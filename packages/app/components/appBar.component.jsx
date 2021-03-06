import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  withStyles, Hidden,
} from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import config from '@cracra/config/app'

import { logout } from '../modules/auth/auth.actions'
import { drawerWidth } from './appDrawer.component'
import logoMyLVUrl from '../assets/images/logo-my-lv-white.svg'
import FeatureFlipping from './featureFlipping'

const styles = theme => ({
  appBar: {
    position: 'absolute',
    width: '100%',
    order: 1,
  },
  appBarDesktop: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  },
  flex: {
    flex: 1,
  },
  logo: {
    height: theme.spacing.unit * 5,
  },
  userDetails: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize',
  },
  avatar: {
    marginLeft: theme.spacing.unit,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  '@media print': {
    appBar: {
      display: 'none',
    },
  },
})

const mapStateToProps = state => ({
  user: state.auth.user,
  shouldCollapseBar: state.display.isDesktop,
})

const mapDispatchToProps = dispatch => bindActionCreators({ logout }, dispatch)

class AppBar extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      anchor: null,
      open: false,
    }
  }

  handleMenuOpen = (event) => {
    this.setState({ open: true, anchor: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ open: false })
  }

  handleLogout = () => {
    this.setState({ open: false })
    this.props.logout()
  }

  render() {
    const {
      user, classes, shouldCollapseBar, onDrawerOpen,
    } = this.props
    const collapsed = shouldCollapseBar && user

    let avatar
    if (user) {
      const fullName = `${user.firstName} ${user.lastName}`
      avatar = (
        <div className={classes.userDetails}>
          <Hidden smDown>
            {fullName}
            <IconButton color="inherit" onClick={this.handleMenuOpen} className={classes.avatar}>
              <Avatar alt={fullName} src={user.profilePictureUrl} />
            </IconButton>
            <Menu
              id="account-menu"
              anchorEl={this.state.anchor}
              open={this.state.open}
              onClose={this.handleMenuClose}
            >
              <MenuItem component={Link} to="/settings" onClick={this.handleMenuClose}>Paramètres</MenuItem>
              <FeatureFlipping feature="redirect">
                <MenuItem component="a" href={config.redirectUrl}>Aller sur Arborescence</MenuItem>
              </FeatureFlipping>
              <MenuItem onClick={this.handleLogout}>Se déconnecter</MenuItem>
            </Menu>
          </Hidden>
        </div>
      )
    }

    let menuButton
    if (!shouldCollapseBar && user) {
      menuButton = (
        <IconButton color="inherit" className={classes.menuButton} onClick={onDrawerOpen}>
          <MenuIcon />
        </IconButton>
      )
    }

    return (
      <MuiAppBar className={classnames(classes.appBar, collapsed && classes.appBarDesktop)}>
        <Toolbar>
          {menuButton}
          <img src={logoMyLVUrl} alt="Logo MyLV" className={classes.logo} />
          <div className={classes.flex} />
          {avatar}
        </Toolbar>
      </MuiAppBar>
    )
  }
}

AppBar.defaultProps = {
  user: null,
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
  }),
  logout: PropTypes.func.isRequired,
  shouldCollapseBar: PropTypes.bool.isRequired,
  onDrawerOpen: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppBar))
