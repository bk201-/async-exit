import { Attach, Signal } from './types';

export const SIGNALS: Signal[] = ['SIGINT', 'SIGHUP', 'SIGQUIT', 'SIGTERM'];
export const DEFAULT_ATTACH: Attach = { signal: true, exception: true, rejection: true, exit: true };
