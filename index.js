
import { Platform } from "react-native";
import FingerprintScannerPlatform from 'react-native-fingerprint-scanner/src/index'
import FingerprintScannerHarmony from "./index.harmony.js";

export const FingerprintScanner = Platform.OS === "harmony"
  ? FingerprintScannerHarmony : FingerprintScannerPlatform;

export default FingerprintScanner;