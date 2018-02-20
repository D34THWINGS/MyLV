import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Typography,
} from 'material-ui'

import * as settingsActions from '../settings.actions'

const mapStateToProps = state => ({
  settings: state.settings,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleProofOfTransportDialog: (_, val) => settingsActions.toggleProofOfTransportDialog(val),
  toggleProcessReminder: (_, val) => settingsActions.toggleProcessReminder(val),
  togglePushNotifications: (_, val) => settingsActions.togglePushNotifications(val),
}, dispatch)

export const SettingsPage = ({
  settings, togglePushNotifications, toggleProofOfTransportDialog, toggleProcessReminder,
}) => (
  <Card>
    <CardContent>
      <Typography variant="headline" component="h2" gutterBottom>
        Paramètres
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Notifications bureau de rappel pour le CRA" />
          <ListItemSecondaryAction>
            <Switch
              disabled={!settings.desktopNotificationsInstalled}
              onChange={togglePushNotifications}
              checked={settings.desktopNotificationsEnabled}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Popup rappel titre de transport" />
          <ListItemSecondaryAction>
            <Switch
              onChange={toggleProofOfTransportDialog}
              checked={settings.shouldDisplayProofOfTransportDialog}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Afficher les tutoriels" />
          <ListItemSecondaryAction>
            <Switch
              onChange={toggleProcessReminder}
              checked={settings.shouldRemindProcess}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </CardContent>
  </Card>
)

SettingsPage.propTypes = {
  togglePushNotifications: PropTypes.func.isRequired,
  toggleProofOfTransportDialog: PropTypes.func.isRequired,
  toggleProcessReminder: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    desktopNotificationsInstalled: PropTypes.bool.isRequired,
    desktopNotificationsEnabled: PropTypes.bool.isRequired,
    shouldDisplayProofOfTransportDialog: PropTypes.bool.isRequired,
    shouldRemindProcess: PropTypes.bool.isRequired,
  }).isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)