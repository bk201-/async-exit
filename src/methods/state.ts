import { AllTypes, State } from '../types';
import store from '../store';

function deep(val: AllTypes): AllTypes {
  const type = typeof val;
  if (type === 'object' && val !== null) {
    if (Array.isArray(val)) {
      return val.map(deep);
    }

    // object
    const value = val as { [key: string]: AllTypes };
    return Object.keys(value).reduce((res: { [key: string]: AllTypes }, key: string) => {
      res[key] = deep(value[key]);
      return res;
    }, {});
  }

  return val;
}

export default function(): State {
  return deep(store.state) as State;
}
