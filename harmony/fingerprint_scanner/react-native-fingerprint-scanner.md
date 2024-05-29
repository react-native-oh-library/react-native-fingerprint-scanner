> 模板版本：v0.1.3

<p align="center">
  <h1 align="center"> <code>react-native-fingerprint-scanner</code> </h1>
</p>
<p align="center">
    <a href="https://github.com/react-native-cameraroll/react-native-cameraroll">
        <img src="https://img.shields.io/badge/platforms-android%20|%20ios%20|%20harmony%20-lightgrey.svg" alt="Supported platforms" />
    </a>
        <a href="https://github.com/react-native-cameraroll/react-native-cameraroll/blob/master/LICENCE">
        <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
    </a>
</p>

> [!tip] [Github 地址](https://github.com/react-native-oh-library/react-native-fingerprint-scanner)

## 安装与使用

请到三方库的 Releases 发布地址查看配套的版本信息：[@react-native-oh-tpl/react-native-fingerprint-scanner Releases](https://github.com/react-native-oh-library/react-native-fingerprint-scanner/releases)，并下载适用版本的 tgz 包。

进入到工程目录并输入以下命令：

> [!TIP] # 处替换为 tgz 包的路径

<!-- tabs:start -->

#### **npm**

```bash
npm install @react-native-oh-tpl/react-native-fingerprint-scanner@file:#
```

#### **yarn**

```bash
yarn add @react-native-oh-tpl/react-native-fingerprint-scanner@file:#
```

<!-- tabs:end -->

快速使用：

> [!WARNING] 使用时 import 的库名不变。

```js
import { View, Button } from "react-native";
import FingerprintScanner from 'react-native-fingerprint-scanner';

export default function App() {
    const handleClick = () => {
    FingerprintScanner
      .isSensorAvailable()
      .then((Biometrics) => {
      }).catch((err) => {
      });
  }
  const handleScanner = () => {
    FingerprintScanner.authenticate({title: '1111'})
      .then(() => {
      }).catch((err) => {
      });
  }
  const handleAttempt = () => {
    let eror = FingerprintScanner.onAttempt()
  }
  const handleRelease = () => {
    FingerprintScanner.release()
  }
  return (
    <View>
       <Button title="authenticate"
          onPress={() => handleScanner()}
        />
      <Button title="isSensorAvailable"
          onPress={() => handleClick()}
        />
        <Button title="onAttempt"
          onPress={() => handleAttempt()}
        />
        <Button title="release"
          onPress={() => handleRelease()}
        />
    </View>
  );
}
```

## Link

目前鸿蒙暂不支持 AutoLink，所以 Link 步骤需要手动配置。

首先需要使用 DevEco Studio 打开项目里的鸿蒙工程 `harmony`

### 引入原生端代码

目前有两种方法：

1. 通过 har 包引入（在 IDE 完善相关功能后该方法会被遗弃，目前首选此方法）；
2. 直接链接源码。

方法一：通过 har 包引入

> [!TIP] har 包位于三方库安装路径的 `harmony` 文件夹下。

打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "@rnoh/react-native-openharmony": "file:../react_native_openharmony",

    "rnoh-fingerprint-scanner-package": "file:../../node_modules/@react-native-oh-tpl/react-native-fingerprint-scanner/harmony/fingerprint_scanner.har"
  }
```

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

方法二：直接链接源码

> [!TIP] 如需使用直接链接源码，请参考[直接链接源码说明](/zh-cn/link-source-code.md)

### 配置 CMakeLists 和引入 FingerprintScannerPackage

打开 `entry/src/main/cpp/CMakeLists.txt`，添加：

```diff
project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(OH_MODULE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../../react-native-harmony/harmony/cpp")

add_subdirectory("${RNOH_CPP_DIR}" ./rn)

# RNOH_BEGIN: add_package_subdirectories
add_subdirectory("../../../../sample_package/src/main/cpp" ./sample-package)
+ add_subdirectory("${OH_MODULE_DIR}/rnoh-fingerprint-scanner-package/src/main/cpp" ./fingerprint_scanner)
# RNOH_END: add_package_subdirectories

add_library(rnoh_app SHARED
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)

target_link_libraries(rnoh_app PUBLIC rnoh)

# RNOH_BEGIN: link_packages
target_link_libraries(rnoh_app PUBLIC rnoh_sample_package)
+ target_link_libraries(rnoh_app PUBLIC rnoh-fingerprint-scanner-package)
# RNOH_END: link_packages
```

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

```diff
#include "RNOH/PackageProvider.h"
#include "SamplePackage.h"
+ #include "FingerprintScannerPackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
      std::make_shared<SamplePackage>(ctx),
+     std::make_shared<FingerprintScannerPackage>(ctx)
    };
}
```

### 在 ArkTs 侧引入 FingerprintScannerPackage

打开 `entry/src/main/ets/RNPackagesFactory.ts`，添加：

```diff
...
+ import { FingerprintScannerPackage } from 'rnoh-fingerprint-scanner/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new SamplePackage(ctx),
+   new FingerprintScannerPackage(ctx),
  ];
}
```

### 应用权限申请

> [!tip] "ohos.permission.ACCESS_BIOMETRIC"权限等级为<B>system_basic</B>
在 `YourProject/entry/src/main/module.json5`补上配置

```diff
{
  "module": {
    "name": "entry",
    "type": "entry",

  ···

    "requestPermissions": [
+     { "name": "ohos.permission.ACCESS_BIOMETRIC" },
    ]
  }
}
```

### 运行

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 约束与限制

### 兼容性

要使用此库，需要使用正确的 React-Native 和 RNOH 版本。另外，还需要使用配套的 DevEco Studio 和 手机 ROM。

请到三方库相应的 Releases 发布地址查看 Release 配套的版本信息：[@react-native-oh-tpl/react-native-fingerprint-scanner Releases](https://github.com/react-native-oh-library/react-native-fingerprint-scanner/releases)


## 属性

> [!tip] "Platform"列表示该属性在原三方库上支持的平台。

> [!tip] "HarmonyOS Support"列为 yes 表示 HarmonyOS 平台支持该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

| Name                           | Description                                                                               | Type             | Required | Platform | HarmonyOS Support |
| ------------------------------ | ----------------------------------------------------------------------------------------- | ---------------- | -------- | -------- | ----------------- |
| `value.title?`                   | the title text to display in the native                                                      | string           | no      | Android      | yes               |
| `value.subTitle?`              | the sub title text to display in the native                  | string           | no      | Android      | no               |
| `value.description?`             | the description text to display in the native                                                                      | string             | no       | All      | no                |
| `value.cancelButton?`                | e cancel button text to display in the native                                                             | string             | no       | Android      | no                |
| `value.onAttempt?`               | a callback function when users are trying to scan their fingerprint but failed.                                                        | function           | no      | Android      | no               |
| `value.fallbackEnabled?`                  | default to true, whether to display fallback button                                                              | boolean            | no      | IOS      | no               |


## 静态方法

> [!tip] "Platform"列表示该属性在原三方库上支持的平台。

> [!tip] "HarmonyOS Support"列为 yes 表示 HarmonyOS 平台支持该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

| Name                                              | Description                                | Type     | Required | Platform | HarmonyOS Support |
| ------------------------------------------------- | ------------------------------------------ | -------- | -------- | -------- | ----------------- |
| `authenticate: (value: authenticate) => Promise<void>;`           | Starts Fingerprint authentication       | function | No       | All      | YES                |
| `isSensorAvailable: () => Promise<string>` | Checks if Fingerprint Scanner is able to be used by now.        | function | No       | All      | YES                |
| `release: () => void`   | Stops fingerprint scanner listener, releases cache of internal state in native code | function | No       | All      | YES                |
| `onAttempt: () => {message?: string}`   | when users are trying to scan their fingerprint but failed | function | No       | HarmonyOS      | YES                |

## 遗留问题



## 其他

## 开源协议

本项目基于 [The MIT License (MIT)](https://github.com/react-native-oh-library/react-native-linear-gradient/blob/harmony/LICENSE) ，请自由地享受和参与开源。