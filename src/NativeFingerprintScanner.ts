/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';
interface authenticate {
    title?: string,
    subTitle?: string,
    description?: string,
    cancelButton?: string
}

export interface Spec extends TurboModule {
    authenticate: (value: authenticate) => Promise<void>;
    isSensorAvailable: () => Promise<string>
    release: () => void
    onAttempt: () => {message?: string}
} 

export default TurboModuleRegistry.get<Spec>('FingerprintScannerNativeModule') as Spec | null;