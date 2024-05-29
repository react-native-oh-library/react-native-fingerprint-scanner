
import { TurboModuleRegistry } from 'react-native';
import authenticate from './authenticate';
import isSensorAvailable from './isSensorAvailable';
import release from './release';

const FingerprintScannerNativeModule =  TurboModuleRegistry.get('FingerprintScannerNativeModule')
export default {
  authenticate: TurboModuleRegistry ? FingerprintScannerNativeModule.authenticate: authenticate,
  release: TurboModuleRegistry ? FingerprintScannerNativeModule.release : release,
  isSensorAvailable: TurboModuleRegistry ? FingerprintScannerNativeModule.isSensorAvailable : isSensorAvailable,
  onAttempt: TurboModuleRegistry ? FingerprintScannerNativeModule.onAttempt : null
};
