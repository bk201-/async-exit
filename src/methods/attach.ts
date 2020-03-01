import { AllTypes, Attach, Signal } from '../types';
import handler from '../handler';
import store from '../store';
import { DEFAULT_ATTACH, SIGNALS } from '../constants';

const signalHandler = (signal: Signal): Promise<void> => {
  return handler('signal', signal);
};

const exceptionHandler = (error: Error): Promise<void> => {
  return handler('exception', error);
};

const rejectionHandler = async (_: {} | null | undefined, reason: Promise<AllTypes>): Promise<void> => {
  const err = await reason.catch((e) => e);
  const error = err instanceof Error ? err : Error(typeof err === 'string' ? err : 'Unhandled promise rejection');
  return handler('rejection', error);
};

const exitHandler = (code: number): Promise<void> => {
  return handler('exit', code);
};

export function attach(options: Partial<Attach> = {}): void {
  const opts: Attach = Object.assign({}, DEFAULT_ATTACH, options);

  const { state } = store;
  const update: Partial<Attach> = {};

  if (opts.signal && !state.attached.signal) {
    update.signal = true;
    // @ts-ignore
    SIGNALS.forEach((signal: Signal) => process.on(signal, signalHandler));
  }
  if (opts.exception && !state.attached.exception) {
    update.exception = true;
    process.on('uncaughtException', exceptionHandler);
  }
  if (opts.rejection && !state.attached.rejection) {
    update.rejection = true;
    process.on('unhandledRejection', rejectionHandler);
  }
  if (opts.exit && !state.attached.exit) {
    update.exit = true;
    process.on('beforeExit', exitHandler);
  }

  if (Object.keys(update).length) {
    state.attached = { ...state.attached, ...update };
  }
}

export function detach(options: Partial<Attach> = {}): void {
  const opts: Attach = Object.assign({}, DEFAULT_ATTACH, options);

  const { state } = store;
  const update: Partial<Attach> = {};

  if (opts.signal && state.attached.signal) {
    update.signal = false;
    SIGNALS.forEach((signal: Signal) => process.removeListener(signal, signalHandler));
  }

  if (opts.exception && state.attached.exception) {
    update.exception = false;
    process.removeListener('uncaughtException', exceptionHandler);
  }

  if (opts.rejection && state.attached.rejection) {
    update.rejection = false;
    process.removeListener('unhandledRejection', rejectionHandler);
  }

  if (opts.exit && state.attached.exit) {
    update.exit = false;
    process.removeListener('beforeExit', exitHandler);
  }

  if (Object.keys(update).length) {
    state.attached = { ...state.attached, ...update };
  }
}
