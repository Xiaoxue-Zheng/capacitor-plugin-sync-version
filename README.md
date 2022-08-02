# capacitor-plugin-sync-version
The idea is from the another project [capacitor-sync-version](https://github.com/arzyu/capacitor-sync-version)

![npm package version](https://img.shields.io/npm/v/capacitor-sync-version?style=flat-square) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green?style=flat-square)

Syncing version from package.json to target platform in the capacitor projects.

The versionName/version and versionCode/build are configured separately in package.json for Android and iOS, because this sync is not 1 to 1 possible without assumtions.

| Android native | package.json     |
|    :----:   |          ---: |
| versionName | androidVersionName  |
| versionCode | androidVersionCode  |


| iOS native | package.json     |
|    :----:   |          ---: |
| version | iOSVersion  |
| build | iOSBuild  |



The androidVersionCode and iOSBuild should be integer and increase each time

Currently supported platforms are: `[android, ios]`.

## Installation

```shell
npm add --save-dev capacitor-plugin-sync-version
```

## Additional preparation for Android only

**Step 1**. Create a file named `app.properties` in `./android/app/`, then add the following properties:

```
versionName=1.0.0
versionCode=1
```
These properties will be updated when capacitor-plugin-sync-version running.

**Step 2**. Adjust codes to referrence these properties in `./android/app/build.gradle`.

* Add the following codes after `apply plugin: 'com.android.application'`:

  ```
  def appProperties = new Properties();
  file("app.properties").withInputStream { appProperties.load(it) }
  ```

* Update properties in `defaultConfig {}` block:

  ```
  defaultConfig {
    versionCode appProperties.getProperty("versionCode").toInteger()
    versionName appProperties.getProperty("versionName")
  }
  ```

## Usage

The simplest way to use capacitor-plugin-sync-version is running it in the [capacitor hooks](https://capacitorjs.com/docs/cli/hooks).

Just adding the following script to `package.json`:

```json
{
  "scripts": {
    "capacitor:copy:before": "capacitor-plugin-sync-version"
  }
}
```

In this way, capacitor-plugin-sync-version will be run before capacitor copy command, e.g., `npx cap copy` `npx cap sync`.

Other ways to run capacitor-sync-version are:

```shell
# sync for android only
capacitor-plugin-sync-version android

# sync for both android and ios
capacitor-plugin-sync-version android ios
```

## Licence

MIT
