import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

import chalk from "chalk";
import plist from "plist";
import { valid } from "semver";

import { log, readPackage } from "./utils";

type PlistVersion = {
  CFBundleShortVersionString: string;
  CFBundleVersion: string;
};

const infoPlistPath = resolve(process.cwd(), "ios/App/App/Info.plist");

export const syncIos = async () => {
  const { iOSVersion, iOSBuild } = readPackage(resolve(process.cwd(), "package.json"));

  if (!valid(iOSVersion)) {
    log(chalk`  {red Invalid iOSVersion in your package.json configuration : "${iOSVersion}". Nothing to do.}`);
    process.exit();
  }

  if (isNaN(parseInt(iOSBuild))) {
    log(chalk`  {red Invalid iOSBuild in your package.json configuration : "${parseInt(iOSBuild)}". Nothing to do.}`);
    process.exit();
  }

  let content = readFileSync(infoPlistPath, { encoding: "utf8" });

  const infoPlist = plist.parse(content) as PlistVersion;

  infoPlist.CFBundleShortVersionString = iOSVersion;
  infoPlist.CFBundleVersion = iOSBuild;

  content = plist.build(infoPlist);

  writeFileSync(infoPlistPath, `${content}\n`, { encoding: "utf8" });
  log(chalk`{green ✔} Sync version ${iOSVersion} and ${iOSBuild} for ios.`);
};
