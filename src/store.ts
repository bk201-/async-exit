import { Store } from './types';

const store: Store = {
  stack: [],
  state: {
    attached: {
      signal: false,
      exception: false,
      rejection: false,
      exit: false,
    },
    triggered: null,
    done: false,
  },
};

export default store;
