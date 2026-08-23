// 네비게이션 제스처가 앱의 다른 모듈보다 먼저 초기화되도록 첫 줄에서 불러옵니다.
import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';

import App from './App';

// Expo Go와 네이티브 빌드가 동일한 최상위 App 컴포넌트를 실행하도록 등록합니다.
registerRootComponent(App);
