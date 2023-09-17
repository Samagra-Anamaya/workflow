import { createMachine, assign } from 'xstate';

const captureLocationMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgGUAVAQQCUKB9AGQHkqARASQDkBxAbQAMAXUSgADgHtYuAC64J+USAAeiACwAmADQgAnog0BWAOwA6ARYEBGNQDYBtk-YDMAX1c60WPIVIsAwlQUHMxc9GQAqv7+AKJkZIIiSCCS0nIKSqoImjr6CFYAnAAcpoaWAhpqAsZVVlZF7p4YOATEJAFBIWExNDTMNIlKqbLyislZOXqIVs4FpgULCxUCRRoatm6NIPgSEHBKXi2+Q1IjGeOIALS2uVe2W4c+xKa4EAA2YCdpo5mIRXNqKy2YFGDQONSaIq3BBFKylSxg5xFexlWxqB7NJ5EUxvCToCAEKBfM5jUBZdZwoHAja2IFAorGG5TBBGMxlCw2eyORkCTZNbytbGwACumEwcHgyWG6VJKgMtNMVOBzlpqoZTLyhTm5QqVRq1ishgxAt8pjAACdzRJzcSZb8WQqlTS6bZ1dCbAJTGpFgVlqt1hoGu5XEA */
    initial: 'idle',
    states: {
      idle: {},
      loading: {},
      success: {},
      error: {},
    },
    on: {
      START_LOADING: 'loading',
      LOCATION_SUCCESS: 'success',
      LOCATION_ERROR: 'error',
    },
  },
  {
    actions: {
    //   setLocationData: assign((context, event) => ({
    //     lat: event.lat,
    //     long: event.long,
    //   })),
    },
  }
);
export default captureLocationMachine