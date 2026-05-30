import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keralafm.app',
  appName: 'Kerala FM',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      backgroundColor: '#0A0B0D'
    }
  }
};

export default config;
