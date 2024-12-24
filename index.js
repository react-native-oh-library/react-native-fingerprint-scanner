
import { Platform } from "react-native";
import FingerprintScannerPlatform from "./index.native.js";
import FingerprintScannerHarmony from "./index.harmony.js";

export const FingerprintScanner = Platform.OS === "harmony"
  ? FingerprintScannerHarmony : FingerprintScannerPlatform;

export default FingerprintScanner;