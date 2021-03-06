import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { Info } from '@material-ui/icons'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  withStyles,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { Helmet } from 'react-helmet'

import { appName } from '@cracra/config/app'
import TextField from '../../../components/inputs/textField.component'
import { postTransportProof, setExpirationDateToCurrentMonth } from '../transport.actions'
import FileField from '../../../components/inputs/fileField.component'

const mapStateToProps = state => ({
  proofExpirationDate: state.transport.expirationDate,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setExpirationDateToCurrentMonth,
  postTransportProof,
}, dispatch)

const validate = ({ file, expirationDate, startingDate }) => ({
  startingDate: !startingDate || /\s/.test(startingDate) ? 'Obligatoire' : null,
  expirationDate: !expirationDate || /\s/.test(expirationDate) ? 'Obligatoire' : null,
  file: !file ? 'Obligatoire' : null,
})

const styles = theme => ({
  uploadButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  uploadInput: {
    display: 'none',
  },
  infoCard: {
    marginBottom: theme.spacing.unit * 3,
  },
})

export const TransportProofPage = ({
  classes,
  valid,
  handleSubmit,
  proofExpirationDate,
  ...actions
}) => (
  <form onSubmit={handleSubmit}>
    <Helmet>
      <title>Mon justificatif de transport | {appName}</title>
    </Helmet>
    {proofExpirationDate >= Date.now() ? (
      <Paper className={classes.infoCard}>
        <List>
          <ListItem>
            <ListItemIcon><Info /></ListItemIcon>
            <ListItemText
              primary={(
                <span>
                  Tu as un justificatif de titre de transport valide jusqu'au&nbsp;
                  <b>{moment(proofExpirationDate).format('DD/MM/YYYY')}</b>
                </span>
              )}
            />
          </ListItem>
        </List>
      </Paper>
    ) : null}
    <Card>
      <CardContent>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              Uploader un justificatif de titre de transport
            </Typography>
            <Typography gutterBottom>
              Ce justificatif te permettra d'être remboursé pour ton titre de transport, merci donc de le fournir
              avant le 25 du mois. Renseigne aussi la date d'expiration du justificatif afin d'être rappellé
              automatiquement lorsque celui-ci arrive à expiration.
            </Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <Field
              name="startingDate"
              type="date"
              label="Date de début de validité"
              fullWidth
              autoFocus
              component={TextField}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Field
              name="expirationDate"
              type="date"
              label="Date d'expiration"
              fullWidth
              component={TextField}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <div className={classes.uploadButtonWrapper}>
              <Button color="primary" onClick={actions.setExpirationDateToCurrentMonth}>Valide pour ce mois</Button>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Field
              name="file"
              accept="jpg,jpeg,JPG,JPEG,pdf,PDF,png,PNG"
              label="Choisir un fichier"
              component={FileField}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" type="submit" disabled={!valid}>Upload</Button>
      </CardActions>
    </Card>
  </form>
)

TransportProofPage.defaultProps = {
  proofExpirationDate: 0,
}

TransportProofPage.propTypes = {
  classes: PropTypes.object.isRequired,
  valid: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setExpirationDateToCurrentMonth: PropTypes.func.isRequired,
  proofExpirationDate: PropTypes.number,
}

const HookedTransportProofPage = reduxForm({
  form: 'transportProofUploadForm',
  validate,
  initialValues: {
    startingDate: moment().set('date', 1).format('YYYY-MM-DD'),
    expirationDate: moment().add(1, 'month').set('date', 1).format('YYYY-MM-DD'),
  },
  onSubmit: ({ file, expirationDate, startingDate }, dispatch, { postTransportProof }) => {
    const multipartFormData = new window.FormData()

    multipartFormData.append('file', file[0])
    multipartFormData.append('startingDate', moment(startingDate).toISOString())
    multipartFormData.append('expirationDate', moment(expirationDate).toISOString())

    postTransportProof(multipartFormData)
  },
})(withStyles(styles)(TransportProofPage))

export default connect(mapStateToProps, mapDispatchToProps)(HookedTransportProofPage)
