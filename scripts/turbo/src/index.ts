import { colors, consola } from '@engine/node-utils';

import { cac } from 'cac';

import { run } from './run';

try {
  const turboRun = cac('turbo');

  turboRun
    .command('[script]')
    .usage(`Run turbo interactively.`)
    .action(async (command: string) => {
      run({ command });
    });

  // Invalid command
  turboRun.on('command:*', () => {
    consola.error(colors.red('Invalid command!'));
    process.exit(1);
  });

  turboRun.usage('turbo');
  turboRun.help();
  turboRun.parse();
} catch (error) {
  consola.error(error);
  process.exit(1);
}
