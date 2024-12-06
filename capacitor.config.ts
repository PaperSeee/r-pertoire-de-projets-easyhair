import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'EasyHair',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '104915930078-r6oq1tjevodtaahg84jdffe2t7m0gu2g.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    },
    Camera: {
      permissions: true
    }
  }

};

export default config;
