import {
  HOLIDAY_DELETE_SUCCESS, HOLIDAYS_FETCH_ERROR, HOLIDAYS_FETCH_START, HOLIDAYS_FETCH_SUCCESS,
  PERSONAL_HOLIDAYS_FETCH_ERROR, PERSONAL_HOLIDAYS_FETCH_START,
  PERSONAL_HOLIDAYS_FETCH_SUCCESS,
} from './holidays.actions'

const initialState = {
  holidaysById: {},
  personalHolidays: [],
  isPersonalLoading: false,
  partnersHolidays: [],
  isPartnersHolidaysLoading: false,
  isUniqueLoading: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case PERSONAL_HOLIDAYS_FETCH_START:
      return {
        ...state,
        personalHolidays: [],
        isPersonalLoading: true,
      }
    case PERSONAL_HOLIDAYS_FETCH_SUCCESS:
      return {
        ...state,
        holidaysById: {
          ...state.holidaysById,
          ...payload.results.reduce((acc, holiday) => ({ ...acc, [holiday.id]: holiday }), {}),
        },
        personalHolidays: payload.results.map(holiday => holiday.id),
        isPersonalLoading: false,
      }
    case PERSONAL_HOLIDAYS_FETCH_ERROR:
      return {
        ...state,
        isPersonalLoading: false,
      }
    case HOLIDAY_DELETE_SUCCESS: {
      const { [payload.id]: _, ...holidaysById } = state.holidaysById
      return {
        ...state,
        holidaysById,
        personalHolidays: state.personalHolidays.filter(holidayId => holidayId !== payload.id),
      }
    }
    case HOLIDAYS_FETCH_START:
      return {
        ...state,
        partnersHolidays: [],
        isPartnersHolidaysLoading: true,
      }
    case HOLIDAYS_FETCH_SUCCESS:
      return {
        ...state,
        holidaysById: {
          ...state.holidaysById,
          ...payload.results.reduce((acc, holiday) => ({ ...acc, [holiday.id]: holiday }), {}),
        },
        partnersHolidays: payload.results.map(holiday => holiday.id),
        isPartnersHolidaysLoading: false,
      }
    case HOLIDAYS_FETCH_ERROR:
      return {
        ...state,
        isPartnersHolidaysLoading: false,
      }
    default:
      return state
  }
}