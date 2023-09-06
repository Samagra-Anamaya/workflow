import { assign, createMachine } from 'xstate';

const formSubmissionMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgZQK4CNMBLWWI1AOwFkBDAYwAsiKwA6IiAGzAGIAxAPIAlKgH1sAVQBCVAJIAVANoAGALqJQAB1RkALuQoaQAD0QBGAGxnWAZjs2ALAE5lNgByWndgDQgAnuZmyqxOlhYA7MrhDmYATB4OsQC+Sb5oWHiEJGSUtIzMbLAExLr6FFD8wmKSMrLY2LICAHLiEgDCbQCi9SrqSCDaegZGpggOFgCsrG7hE67Kk+FBMb4BCMusc8rbcW7KDuFuFilpGDjF2QZ5TCysRVmlzBWCIq219Y0tfACCsgAyEiEnV6RkGRH0lBGiHGUxmcxsCwmS32ZlWiFiQVY22xEwsTjcExs8WSJxAFFQEDgRnS5yypCu9BuYFBOnBw36owAtBY0QhuaSaZliPTcoyCuwuMz+mCIYYOdDYryzMrWDELHi3LEJkcbBYDgKzkLLqL8rd7iUylAWUNIfKEPZpg4bOFwjZlbELK5xkqVWqIlEYvEzA4DRkLiLqGKzbg6HQ4PBpazZVCELMbCE3E4rLi3HsJit-IgPJtsQHCQSnE4Sacw3ScpHTWxkDQiJxcOgpVok+zQKM0xms2Yc3mC2szDMsdjlTMzKEYhMUikgA */
    id: 'formSubmissionMachine',
    initial: 'idle',
    context: {
      isSubmitted: false,
    },
    states: {      
      idle: {
        on: {
          FORM_SUBMIT: 'submitting',
        },
      },
      submitting: {
        on: {
          FORM_SUBMISSION_SUCCESS: 'success',
          FORM_SUBMISSION_FAILURE: 'failure',
        },
      },
      success: {       
       entry:'setSubmitted',
      },
      failure: {
       entry:'setSubmitted'
      },
    },
  },
  {
    actions: {
      setSubmitted:assign({
        isSubmitted:true,
      }),
      setSubmitted:assign({
        isSubmitted:false,
      })
    },
  }
);

export default formSubmissionMachine;
