# LipLux Mobile App Setup Guide

This guide will help you convert your LipLux website into a mobile app that users can download as an APK for Android and install as a web app on iOS.

## 🚀 Quick Start

### 1. Install Dependencies

First, install Node.js if you haven't already, then run:

```bash
npm install
```

### 2. Test as PWA (Progressive Web App)

```bash
npm run serve
```

This will start a local server. Open the website in Chrome/Edge and you'll see an "Install" button appear after a few seconds.

### 3. Generate App Icons

1. Open `generate-icons.html` in your browser
2. Click "Generate All Icons"
3. Download all the generated icons
4. Save them in the `/icons/` folder

## 📱 For Android APK Generation

### Prerequisites
- Node.js (v16 or higher)
- Android Studio
- Java Development Kit (JDK 11 or higher)

### Steps

1. **Install Capacitor:**
   ```bash
   npm run install-capacitor
   ```

2. **Initialize Capacitor:**
   ```bash
   npm run cap-init
   ```

3. **Add Android platform:**
   ```bash
   npm run cap-add-android
   ```

4. **Sync files:**
   ```bash
   npm run cap-sync
   ```

5. **Open in Android Studio:**
   ```bash
   npm run cap-open-android
   ```

6. **Build APK in Android Studio:**
   - In Android Studio, go to `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - The APK will be generated in `android/app/build/outputs/apk/debug/`

### Alternative: Direct APK Generation
```bash
npm run generate-apk
```

## 🍎 For iOS App

### Prerequisites
- macOS
- Xcode
- iOS Developer Account (for App Store distribution)

### Steps

1. **Add iOS platform:**
   ```bash
   npm run cap-add-ios
   ```

2. **Open in Xcode:**
   ```bash
   npx cap open ios
   ```

3. **Build in Xcode:**
   - Configure signing & capabilities
   - Build and archive for distribution

## 🌐 Progressive Web App (PWA) Features

Your LipLux website now includes:

- ✅ **Installable**: Users can install it like a native app
- ✅ **Offline Support**: Works without internet connection
- ✅ **App-like Experience**: Full-screen, no browser UI
- ✅ **Push Notifications**: Ready for future implementation
- ✅ **Auto-updates**: Automatically updates when you deploy changes

## 📋 Files Added for Mobile App

- `manifest.json` - PWA configuration
- `sw.js` - Service worker for offline functionality
- `capacitor.config.ts` - Capacitor configuration for native apps
- `package.json` - Dependencies and build scripts
- `generate-icons.html` - Icon generator tool
- `/icons/` - App icons directory

## 🔧 Customization

### App Colors
Edit these in `manifest.json`:
- `theme_color`: "#ff69b4" (your brand pink)
- `background_color`: "#ff69b4"

### App Name
Edit in `manifest.json`:
- `name`: "LipLux By Jay - Glossy Vibes, Timeless Beauty"
- `short_name`: "LipLux"

### App ID (for native apps)
Edit in `capacitor.config.ts`:
- `appId`: "com.liplux.app"

## 📱 How Users Will Install

### Android Users:
1. Visit your website on Chrome/Edge
2. See "Install LipLux app" banner
3. Click "Install" 
4. App appears on home screen

### Alternative for Android:
1. Download the APK file you generate
2. Enable "Install from unknown sources" in Android settings
3. Install the APK
4. App appears on home screen

### iOS Users:
1. Visit your website in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. App appears on home screen

## 🚀 Deployment

### For PWA (Recommended):
1. Upload all files to your web server
2. Ensure HTTPS is enabled
3. Users can install directly from your website

### For APK Distribution:
1. Generate signed APK using Android Studio
2. Host the APK file on your website
3. Users download and install manually
4. Consider using Firebase App Distribution for easier distribution

## 🔍 Testing

### Test PWA Features:
```bash
npm run test-pwa
```

### Test on Mobile:
1. Use Chrome DevTools Device Mode
2. Test on actual devices
3. Check install prompt appears
4. Verify offline functionality

## 📊 Analytics & Tracking

The app includes:
- Install prompt tracking
- Service worker registration tracking
- App installation success tracking

## 🛠️ Troubleshooting

### PWA Install Button Not Showing:
- Ensure HTTPS is enabled
- Check browser console for errors
- Verify manifest.json is accessible
- Make sure service worker registers successfully

### APK Build Issues:
- Ensure Android Studio is properly installed
- Check Java version (JDK 11+ required)
- Verify Android SDK is up to date

### Icons Not Loading:
- Generate icons using the provided tool
- Ensure all icon sizes are present in `/icons/` folder
- Check file paths in manifest.json

## 📞 Support

For issues with mobile app setup:
1. Check browser console for errors
2. Verify all files are uploaded correctly
3. Test on different devices and browsers
4. Ensure HTTPS is properly configured

## 🎉 Success!

Once set up, your users will have:
- A native-like app experience
- Offline browsing capability
- Home screen icon
- Push notification support (future)
- Automatic updates

Your LipLux website is now a full mobile app! 🎊
