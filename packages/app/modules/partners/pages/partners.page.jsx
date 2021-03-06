import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types'
import {
  Typography, Table, TableBody, TableHead, TableRow, TableCell, withStyles,
  TableFooter, TablePagination, Paper, Toolbar, CardActions, Button,
} from '@material-ui/core'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { labels } from '@cracra/shared/calendar.constants'

import { appName } from '@cracra/config/app'
import LoadingPage from '../../../components/loadingPage.component'
import { fetchPartners, notifyAllPartners } from '../partners.actions'
import { getPartnersList } from '../partners.selectors'

const mapStateToProps = state => ({
  partners: getPartnersList(state),
  pageCount: state.partners.pageCount,
  limit: state.partners.limit,
  isLoading: state.partners.isLoading,
  labels: state.worklog.labels,
})

const mapDispatchToProps = dispatch => bindActionCreators({ fetchPartners, push, notifyAllPartners }, dispatch)

const styles = theme => ({
  fullNameCell: {
    width: '70%',
  },
  [theme.breakpoints.down('md')]: {
    entryCountCell: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  partnersTable: {
    overflowY: 'visible',
  },
  tableFooter: {
    width: '100%',
  },
  incompleteWorklog: {
    backgroundColor: theme.palette.error.light,
    '&:hover': {
      backgroundColor: `${theme.palette.error.main} !important`,
    },
  },
})

export class PartnersPage extends Component {
  componentWillMount() {
    this.props.fetchPartners({
      page: this.getPageNumber(),
      limit: this.props.limit,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.props.fetchPartners({
        page: this.getPageNumber(nextProps),
        limit: nextProps.limit,
      })
    }
  }

  getPageNumber = (props = this.props) => Number(qs.parse(props.location.search.slice(1)).page || 1)

  getRowDisplay = () => `${this.getPageNumber()} of ${this.props.pageCount}`

  handleChangePage = (event, page) => this.props.push(`/partners?page=${page + 1}`)

  handleGoToPartnerWorklog = partnerId => () => this.props.push(`/partners/${partnerId}`)

  handleChangeRowsPerPage = event => this.props.fetchPartners({
    page: this.getPageNumber(),
    limit: event.target.value,
  })

  render() {
    const {
      partners,
      isLoading,
      classes,
      pageCount,
      limit,
      notifyAllPartners,
    } = this.props
    const inValidWorklogClasses = { root: classes.incompleteWorklog }

    if (isLoading) {
      return <LoadingPage />
    }

    return (
      <Paper>
        <Helmet>
          <title>Partners | {appName}</title>
        </Helmet>
        <Toolbar>
          <Typography variant="h5" component="h2" gutterBottom>
            Partners
          </Typography>
        </Toolbar>
        <div className={classes.tableWrapper}>
          <Table className={classes.partnersTable}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.fullNameCell}>Nom</TableCell>
                {Array.from(labels.values()).map(label => (
                  <TableCell numeric key={label} className={classes.entryCountCell}>{label}</TableCell>
                ))}
                <TableCell numeric>Déjeuners</TableCell>
                <TableCell numeric>Ticket restaurants</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partners.map(partner => (
                <TableRow
                  hover
                  key={partner.id}
                  classes={partner.isWorklogComplete ? undefined : inValidWorklogClasses}
                  onClick={this.handleGoToPartnerWorklog(partner.id)}
                >
                  <TableCell>
                    {partner.firstName} {partner.lastName}
                  </TableCell>
                  {Array.from(labels.keys()).map(key => (
                    <TableCell numeric key={key} className={classes.entryCountCell}>
                      {(partner.entryCounts && partner.entryCounts[key]) || 0}
                    </TableCell>
                  ))}
                  <TableCell numeric>{partner.lunchesCount}</TableCell>
                  <TableCell numeric>{partner.mealVouchers}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <table className={classes.tableFooter}>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={pageCount * limit}
                rowsPerPage={limit}
                labelDisplayedRows={this.getRowDisplay}
                page={this.getPageNumber() - 1}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                rowsPerPageOptions={[25, 50, 100]}
              />
            </TableRow>
          </TableFooter>
        </table>
        <CardActions>
          <Button color="primary" onClick={notifyAllPartners}>Envoyer un rappel</Button>
        </CardActions>
      </Paper>
    )
  }
}

PartnersPage.propTypes = {
  fetchPartners: PropTypes.func.isRequired,
  notifyAllPartners: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  partners: PropTypes.arrayOf(PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    lunchesCount: PropTypes.number,
    mealVouchers: PropTypes.number,
    entryCounts: PropTypes.object,
    isWorklogComplete: PropTypes.bool,
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  pageCount: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PartnersPage))
