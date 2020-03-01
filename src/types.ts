export type ExitType = 'signal' | 'exception' | 'rejection' | 'exit';

export type Signal = 'SIGINT' | 'SIGHUP' | 'SIGQUIT' | 'SIGTERM';

export type AllTypes = {} | [] | null | undefined | number | string | boolean | symbol | (() => void);

export interface Attach {
  signal: boolean;
  exception: boolean;
  rejection: boolean;
  exit: boolean;
}

export type Triggered = null | {
  type: ExitType;
  arg: Signal | Error | number;
};

export interface State {
  attached: Attach;
  triggered: Triggered;
  done: boolean;
}

export type Callback = (type: ExitType, arg: Signal | Error | number) => Promise<void> | void;

export interface Store {
  stack: Array<{
    on: Attach;
    fn: Callback;
  }>;
  state: State;
}
