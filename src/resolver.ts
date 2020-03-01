import { ExitType, Signal } from './types';

function resolver(type: 'signal', arg: Signal): void;
function resolver(type: 'exception' | 'rejection', arg: Error): void;
function resolver(type: 'exit', arg: number): void;
function resolver(type: ExitType, arg: Signal | Error | number): void;
function resolver(type: ExitType, arg: Signal | Error | number): void {
  switch (type) {
    case 'signal':
      return process.kill(process.pid, arg as Signal);
    case 'exit':
      return process.exit(Number(arg));
    case 'exception':
    case 'rejection':
      setImmediate(() => {
        throw arg;
      });
  }
}

export default resolver;
