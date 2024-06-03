
import { TurboModuleRegistry } from 'react-native';

const FingerprintScannerNativeModule =  TurboModuleRegistry.get('FingerprintScannerNativeModule')
export default {
  authenticate: FingerprintScannerNativeModule.authenticate,
  release: FingerprintScannerNativeModule.release ,
  isSensorAvailable: FingerprintScannerNativeModule.isSensorAvailable,
  onAttempt: FingerprintScannerNativeModule.onAttempt
};
