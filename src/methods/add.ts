import store from '../store';
import { Attach, Callback } from '../types';
import { DEFAULT_ATTACH } from '../constants';

function add(fn: Callback, options?: Partial<Attach>): () => void {
  store.stack.push({ fn, on: Object.assign({}, DEFAULT_ATTACH, options) });

  return (): void => {
    for (let i = 0; i < store.stack.length; i++) {
      if (store.stack[i].fn === fn) {
        store.stack = store.stack.slice(0, i).concat(store.stack.slice(i + 1));
      }
    }
  };
}

export default add;
