/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import type { BusinessError } from '@ohos.base';
import userIAM_userAuth from '@ohos.userIAM.userAuth';
import Logger from './Logger'

export class RNFingerprintScannerTurboModule extends TurboModule implements TM.FingerprintScannerNativeModule.Spec {
  constructor(ctx) {
    super(ctx);
  }

  userAuthInstance: any = null;
  errorMessage: string = ''


  onAttempt(): { message?: string | undefined; } {
    return {
      message: this.errorMessage
    }
  }

  authenticate(value: TM.FingerprintScannerNativeModule.authenticate): Promise<void> {
    return new Promise((resolve, reject) => {
      this.errorMessage = ''
      // 设置认证参数
      const authParam: userIAM_userAuth.AuthParam = {
        challenge: new Uint8Array([49, 49, 49, 49, 49, 49]),
        authType: [userIAM_userAuth.UserAuthType.FINGERPRINT],
        authTrustLevel: userIAM_userAuth.AuthTrustLevel.ATL1,
      };
      // 配置认证界面
      const widgetParam: userIAM_userAuth.WidgetParam = {
        title: value.title,
      };
      const that = this
      try {
        // 获取认证对象
        this.userAuthInstance = userIAM_userAuth.getUserAuthInstance(authParam, widgetParam);
        this.userAuthInstance.start();
        // 订阅认证结果
        this.userAuthInstance.on('result', {
          onResult(result) {
            const code = result.result
            if (code === userIAM_userAuth.UserAuthResultCode.SUCCESS) {
              resolve()
            } else {
              reject({
                message: code.toString()
              })
              that.errorMessage = code.toString()
              Logger.info('userAuthInstance callback result = ', code);

            }
            that.userAuthInstance.off('result');
            that.userAuthInstance = null

          }
        });

      } catch (error) {
        const err: BusinessError = error as BusinessError;
        this.errorMessage = err?.code.toString()
        console.info(`auth catch error. Code is ${err?.code}, message is ${err?.message}`);
        Logger.error('失败', JSON.stringify(error));
        reject({
          message: err?.code.toString()
        })
      }
    })
  }


  isSensorAvailable(): Promise<string> {
    this.errorMessage = ''
    return new Promise((resolve, reject) => {
      try {
        userIAM_userAuth.getAvailableStatus(userIAM_userAuth.UserAuthType.FINGERPRINT,
          userIAM_userAuth.AuthTrustLevel.ATL1);
        resolve('Biometrics')
        this.errorMessage = ''
      } catch (error) {
        const err: BusinessError = error as BusinessError;
        this.errorMessage = err?.code.toString()
        reject({
          message: err?.code.toString()
        })
        Logger.error('current auth trust level is not supported. ' + JSON.stringify(err));
      }
    });

  }

  release(): void {
    if (!this.errorMessage) {
      this.userAuthInstance?.cancel()
    }
  }
}