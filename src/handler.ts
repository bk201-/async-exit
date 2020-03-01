import { ExitType, Signal } from './types';
import store from './store';
import { detach } from './methods/attach';
import resolver from './resolver';

function handler(type: 'signal', arg: Signal): Promise<void>;
function handler(type: 'exception' | 'rejection', arg: Error): Promise<void>;
function handler(type: 'exit', arg: number): Promise<void>;
async function handler(type: ExitType, arg: Signal | Error | number): Promise<void> {
  const { state, stack } = store;
  try {
    if (state.triggered) return;

    // Update state
    state.triggered = { type, arg };

    // Wait for processes to close
    while (stack.length) {
      const element = stack.shift();
      if (element && element.on[type]) {
        try {
          await element.fn(type, arg);
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }

  // Update state
  state.done = true;

  // Detach self
  detach();

  resolver(type, arg);
}

export default handler;
