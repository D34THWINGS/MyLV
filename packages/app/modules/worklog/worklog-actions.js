import qs from 'qs'

import { fetchWithAuth } from '../auth/auth.actions'
import { fetchPartnersSuccess } from '../partners/partners.actions'

export const WORKLOG_FILL_MORNING = 'WORKLOG_FILL_MORNING'
export const WORKLOG_FILL_AFTERNOON = 'WORKLOG_FILL_AFTERNOON'
export const WORKLOG_FILL_DAY = 'WORKLOG_FILL_DAY'
export const WORKLOG_FILL_WEEK = 'WORKLOG_FILL_WEEK'
export const WORKLOG_FILL_MONTH = 'WORKLOG_FILL_MONTH'
export const WORKLOG_FILL_RANGE = 'WORKLOG_FILL_RANGE'
export const WORKLOG_EMPTY_DAY = 'WORKLOG_EMPTY_DAY'
export const WORKLOG_SAVE_SUCCESS = 'WORKLOG_SAVE_SUCCESS'
export const WORKLOG_GET_START = 'WORKLOG_GET_START'
export const WORKLOG_GET_SUCCESS = 'WORKLOG_GET_SUCCESS'
export const WORKLOG_GET_ERROR = 'WORKLOG_GET_ERROR'

export const saveWorklog = preSaveAction => (dispatch, getState) => {
  if (preSaveAction) {
    dispatch(preSaveAction)
  }

  const { worklog: { pending, worklogId } } = getState()

  if (Object.keys(pending).length === 0) {
    return Promise.resolve()
  }

  return dispatch(fetchWithAuth(`/api/worklog/${worklogId}`, {
    method: 'PUT',
    body: Object.entries(pending).map(([date, label]) => ({ date, label })),
  }))
    .then(() => dispatch({ type: WORKLOG_SAVE_SUCCESS }))
}

export const fillMorning = (date, label) => saveWorklog({
  type: WORKLOG_FILL_MORNING,
  payload: { date, label },
})

export const fillAfternoon = (date, label) => saveWorklog({
  type: WORKLOG_FILL_AFTERNOON,
  payload: { date, label },
})

export const fillDay = (day, label) => saveWorklog({
  type: WORKLOG_FILL_DAY,
  payload: { day, label },
})

export const fillWeek = (day, label) => saveWorklog({
  type: WORKLOG_FILL_WEEK,
  payload: { day, label },
})

export const fillMonth = (month, label) => saveWorklog({
  type: WORKLOG_FILL_MONTH,
  payload: { month, label },
})

export const fillRange = (start, end, label) => saveWorklog({
  type: WORKLOG_FILL_RANGE,
  payload: { start, end, label },
})

export const emptyDay = day => saveWorklog({
  type: WORKLOG_EMPTY_DAY,
  payload: { day },
})

export const getWorklog = (year, month, partnerId) => async (dispatch, getState) => {
  dispatch({ type: WORKLOG_GET_START })

  try {
    const id = partnerId || getState().auth.user.id
    const query = qs.stringify({ year, month })
    const url = `/api/worklog/${id}?${query}`
    const { results: entries, partner } = await dispatch(fetchWithAuth(url))
    dispatch(fetchPartnersSuccess({ results: [partner] }))
    dispatch({ type: WORKLOG_GET_SUCCESS, payload: { entries, id } })
  } catch (e) {
    dispatch({ type: WORKLOG_GET_ERROR })
  }
}
