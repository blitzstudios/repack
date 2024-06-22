import chalk from 'chalk';
let verbose = false;
const logger = {
    success: (message) => console.log(`${chalk.green('✔')} ${message}`),
    warn: (message) => console.log(`${chalk.yellow('⚑')} ${message}`),
    error: (message) => console.log(`${chalk.red('✖')} ${message}`),
    fatal: (message) => console.log(`\n💥 ${chalk.redBright(message)}`),
    done: (message) => console.log(`\n🎉 ${chalk.greenBright(message)}`),
    info: (message) => verbose && console.log(`${chalk.blue('ℹ')} ${message}`),
};
export default logger;
export function enableVerboseLogging() {
    verbose = true;
}
