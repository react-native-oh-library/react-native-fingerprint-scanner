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
  errorObj:{ message?: string | undefined; } ={
  }


  onAttempt(): { message?: string | undefined; } {
    return this.errorObj
  }

  authenticate(value: TM.FingerprintScannerNativeModule.authenticate): Promise<void> {
    return new Promise((resolve, reject) => {
      this.errorObj = {}
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
              that.errorObj = {
                message: code.toString()
              }
              Logger.info('userAuthInstance callback result = ', code);

            }
            that.userAuthInstance.off('result');
          }
        });

      } catch (error) {
        const err: BusinessError = error as BusinessError;
        this.errorObj = {
          message: err?.code.toString()
        }
        console.info(`auth catch error. Code is ${err?.code}, message is ${err?.message}`);
        Logger.error('失败', JSON.stringify(error));
        reject({
          message: err?.code.toString()
        })
      }
    })
  }


  isSensorAvailable(): Promise<string> {
    this.errorObj = {}
    return new Promise((resolve, reject) => {
      try {
        userIAM_userAuth.getAvailableStatus(userIAM_userAuth.UserAuthType.FINGERPRINT,
          userIAM_userAuth.AuthTrustLevel.ATL1);
        resolve('Biometrics')
        this.errorObj = {}
      } catch (error) {
        const err: BusinessError = error as BusinessError;
        this.errorObj = {
          message: err?.code.toString()
        }
        reject({
          message: err?.code.toString()
        })
        Logger.error('current auth trust level is not supported. ' + JSON.stringify(err));
      }
    });

  }

  release(): void {
    if (!this.errorObj?.message) {
      this.userAuthInstance?.cancel()

    }
  }
}