import { Command, action } from 'commander';
import * as actions from './actions';
import { logger } from './util';
const { version } = require('../package.json');

const program = new Command();
program.version(version, '-v, --version', 'output the current version');

program
  .command('device')
  .description('Show info about connected device')
  .action(() => runAction(actions.showDeviceInfo()));

program
  .command('launch <appId>')
  .description('Launch an app')
  .action((appId: string) => runAction(actions.launchApp(appId)));

program
  .command('close <appId>')
  .description('Close a running app')
  .action((appId: string) => runAction(actions.closeApp(appId)));

program
  .command('get <appId>')
  .description('Get details about an installed app')
  .action((appId: string) => runAction(actions.showAppInfo(appId)));

program
  .command('install')
  .alias('i')
  .description('Install a packaged app')
  .requiredOption(
    '-i, --id <appId>',
    'The ID of the app. This should be the same as in manifest.webapp'
  )
  .requiredOption('-p, --path <path>', 'Path to the packaged application (zip file)')
  .action(({ id, path }) => runAction(actions.installApp(id, path)));

program
  .command('uninstall <appId>')
  .alias('un')
  .description('Uninstall an app')
  .action((appId: string) => runAction(actions.uninstallApp(appId)));

program
  .command('list')
  .description('List installed apps')
  .option('-i, --installed', 'List installed apps', true)
  .option('-r, --running', 'List running apps')
  .action(async (cmd) => {
    const options = cmd.opts();

    if (options.running) {
      await runAction(actions.listRunningApps());
      process.exit(0);
    }

    await runAction(actions.listInstalledApps());
  });

program
  .command('info <appId>')
  .description('Get details about an installed app')
  .action((appId: string) => runAction(actions.showAppInfo(appId)));

async function runAction(promise: Promise<any>) {
  return promise.catch((err) => {
    logger.error(err.message);
    process.exit(1);
  });
}

program.parse(process.argv);
