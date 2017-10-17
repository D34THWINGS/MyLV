import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles } from 'material-ui'

import PartnerAutocomplete from './partnerAutocomplete.component'

const styles = () => ({
  dialogContent: {
    overflowY: 'visible'
  }
})

class PartnerDialog extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      partnerId: null
    }
  }

  handlePartnerSelect = (e, { suggestion: partner }) => this.setState({ partnerId: partner.id })

  handleFormSubmit = e => {
    e.preventDefault()
    this.props.onPartnerSelected(this.state.partnerId)
    this.props.onRequestClose()
  }

  render () {
    const { classes, title, description, action, open, onRequestClose } = this.props

    return (
      <Dialog open={open} onRequestClose={onRequestClose}>
        <form onSubmit={this.handleFormSubmit}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <DialogContentText>{description}</DialogContentText>
            <PartnerAutocomplete onChange={this.handlePartnerSelect} excludeSelf />
          </DialogContent>
          <DialogActions>
            <Button dense onClick={onRequestClose}>
              Annuler
            </Button>
            <Button dense color='primary' type='submit' disabled={!this.state.partnerId}>{action}</Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

PartnerDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onPartnerSelected: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired
}

export default withStyles(styles)(PartnerDialog)