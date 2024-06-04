import { Platform } from "react-native";
import authenticateAndroid from 'react-native-fingerprint-scanner/src/authenticate.android';
import authenticateIos from 'react-native-fingerprint-scanner/src/authenticate.ios';
import isSensorAvailableAndroid from 'react-native-fingerprint-scanner/src/isSensorAvailable.android';
import isSensorAvailableIos from 'react-native-fingerprint-scanner/src/isSensorAvailable.android';
import releaseAndroid from 'react-native-fingerprint-scanner/src/release.android';
import releaseIos from 'react-native-fingerprint-scanner/src/release.ios';

export default {
  authenticate: Platform.OS === "android" ? authenticateAndroid : authenticateIos,
  isSensorAvailable: Platform.OS === "android" ? isSensorAvailableAndroid : isSensorAvailableIos,
  release: Platform.OS === "android" ? releaseAndroid : releaseIos,
};