import { createMachine, assign } from 'xstate';

const authMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgWWQY0wEsA7MAOgLDwGsSoBiAQQFUAVACQFEA5VgSQDCjVpwAiAbQAMAXUSgADgHtYhdIUXE5IAB6IAjAFYAbGQDMATgMAOUwHZb50wBZbpvQBoQAT32SnZA0kgvSc9KwMXK0kDAF8YzzQsXAISckoaOnpmbhYOHn4hEQkZLSUVNQ0tXQRDEwtrOwdnVw9vRAAmPUkyIKDjWz1zQ1srWzj4kGJFCDgtRJx8IlJS5VV1TSQdRABaI08fBF2e3skLKyMjSXbOoziEjAWU0gpMKlpiKBXy9arEJ3b9vo9HoyKEjLZTu1zA4DIF2ncQPNkktyPMwMQ1HhkOhIF81pVNtVTNYyIMHO0RgYHEZzHs2ggrCDAr1nAZBmzbLcJkjFqkyKhiGiMYQsTiIHiKhtQESSWTzBTwtTaYCaqNjkEnAZzOEjG4uXEgA */
    id: 'authMachine',
    initial: 'checking',
    context: {
      isAuthenticated: false,
    },
    states: {
      checking: {
        on: {
          AUTHENTICATED: 'authenticated',
          UNAUTHENTICATED: 'unauthenticated',
        },
      },
      authenticated: {
        entry: 'setAuthenticated',
      },
      unauthenticated: {
        entry: 'setUnauthenticated',
      },
    },
  },
  {
    actions: {
      setAuthenticated: assign({
        isAuthenticated: true,
      }),
      setUnauthenticated: assign({
        isAuthenticated: false,
      }),
    },
  }
);

export default authMachine;
