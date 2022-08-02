import { resolve } from "path";

import to from "await-to-js";
import chalk from "chalk";
import readProps from "properties-reader";
import { valid } from "semver";

import { log, readPackage } from "./utils";

const appPropertiesPath = resolve(process.cwd(), "android/app/app.properties");


export const syncAndroid = async () => {
  const { androidVersionName, androidVersionCode } = readPackage(resolve(process.cwd(), "package.json"));

  if (!valid(androidVersionName)) {
    log(chalk`  {red Invalid androidVersionName: "${androidVersionName}". Nothing to do.}`);
    process.exit();
  }

  if (isNaN(parseInt(androidVersionCode))) {
    log(chalk`  {red Invalid androidVersionCode: "${parseInt(androidVersionCode)}". Nothing to do.}`);
    process.exit();
  }

  const appProps = readProps(appPropertiesPath);

  appProps.set("versionCode", androidVersionCode);
  appProps.set("versionName", androidVersionName);

  const [err] = await to(appProps.save(appPropertiesPath));

  if (err) {
    log(chalk`  {red Failed to sync version ${err.message}}`);
    process.exit();
  }

  log(chalk`{green ✔} Sync version ${androidVersionCode} and ${androidVersionName} for android.`);
};
