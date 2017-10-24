import React from 'react'
import PropTypes from 'prop-types'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui'
import { Link } from 'react-router-dom'

const ProofOfTransportDialog = ({ open, onRequestClose, onDecline }) => (
  <Dialog open={open} onRequestClose={onRequestClose}>
    <DialogTitle>Titre de transport requis</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Tu as oublié de fournir un justificatif d'achat de titre de transport pour ce mois.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onRequestClose} color='default'>
        Passer
      </Button>
      <Button onClick={onDecline}>
        Je n'ai pas de titre de transport
      </Button>
      <Button color='primary' component={Link} to='/proof-upload'>
        Uploader
      </Button>
    </DialogActions>
  </Dialog>
)

ProofOfTransportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
}

export default ProofOfTransportDialog
