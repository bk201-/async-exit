import resolver from '../resolver';
import handler from '../handler';
import { ExitType, Signal } from '../types';
import store from '../store';

function terminate(type: 'signal', arg: Signal): Promise<void>;
function terminate(type: 'exception' | 'rejection', arg: Error): Promise<void>;
function terminate(type: 'exit', arg: number): Promise<void>;
async function terminate(type: ExitType, arg: Signal | Error | number): Promise<void> {
  switch (type) {
    case 'signal':
      if (store.state.attached.signal) return handler('signal', arg as Signal);
      break;
    case 'exception':
      if (store.state.attached.exception) return handler('exception', arg as Error);
      break;
    case 'rejection':
      if (store.state.attached.rejection) return handler('rejection', arg as Error);
      break;
    case 'exit':
      if (store.state.attached.exit) return handler('exit', arg as number);
      break;
    default:
      break;
  }

  return resolver(type, arg);
}

export default terminate;
