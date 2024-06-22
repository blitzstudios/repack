import checkPackageManager from './tasks/checkPackageManager.js';
import checkReactNative from './tasks/checkReactNative.js';
import addDependencies from './tasks/addDependencies.js';
import createWebpackConfig from './tasks/createWebpackConfig.js';
import handleReactNativeConfig from './tasks/handleReactNativeConfig.js';
import modifyIOS from './tasks/modifyIOS.js';
import modifyAndroid from './tasks/modifyAndroid.js';
import logger, { enableVerboseLogging } from './utils/logger.js';
export default async function run({ entry, repackVersion, templateType, verbose, }) {
    const cwd = process.cwd();
    if (verbose) {
        enableVerboseLogging();
    }
    try {
        const packageManager = await checkPackageManager(cwd);
        const reactNativeVersion = checkReactNative(cwd);
        await addDependencies(packageManager, repackVersion);
        await createWebpackConfig(cwd, templateType, entry);
        handleReactNativeConfig(cwd);
        modifyAndroid(cwd, reactNativeVersion);
        modifyIOS(cwd);
        logger.done('Setup complete. Thanks for using Re.Pack!');
    }
    catch (error) {
        logger.fatal('Re.Pack setup failed\n\nWhat went wrong:');
        if (error instanceof Error) {
            logger.error(error.message);
        }
        else {
            logger.error(error);
        }
        process.exit(1);
    }
}
