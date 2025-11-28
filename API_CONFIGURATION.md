# API Configuration Fixed

## Problem
Your app was using hardcoded localhost URLs (`http://10.0.2.2:3000/api`) which don't work with your Render deployment at `https://woocommerce-1dee.onrender.com`.

## Changes Made

### 1. Created Centralized API Configuration
- **File**: `config/api.config.ts`
- This file exports `API_BASE_URL` which uses your Render URL by default
- Can be overridden with environment variable `EXPO_PUBLIC_API_URL`

### 2. Updated All Product/Category Screens
Updated the following files to use the centralized configuration:
- ✅ `app/(authorized)/(tabs)/index.tsx` (Home screen)
- ✅ `app/(authorized)/products/index.tsx` (All products)
- ✅ `app/(authorized)/products/[id].tsx` (Product details)
- ✅ `app/(authorized)/categories/index.tsx` (All categories)
- ✅ `app/(authorized)/categories/[name].tsx` (Category products)

### 3. Updated app.json
Added API URL to the `extra` configuration:
```json
"extra": {
  "apiUrl": "https://woocommerce-1dee.onrender.com"
}
```

## How to Use

### Option 1: Use Default Configuration (Recommended)
The app now uses `https://woocommerce-1dee.onrender.com` by default. No additional setup needed!

### Option 2: Use Environment Variables
If you want to use a different API URL:

1. Create a `.env` file in the project root:
```bash
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

2. Restart your development server:
```bash
npx expo start -c
```

## Testing

1. **Clear the cache and restart:**
```bash
npx expo start -c
```

2. **Rebuild your app:**
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

3. **Check the API URL in code:**
The app now uses `API_BASE_URL` from `config/api.config.ts` throughout

## Troubleshooting

### Still getting "Network request failed"?

1. **Check your backend is running:**
   - Visit: https://woocommerce-1dee.onrender.com/api/products
   - Should return JSON data

2. **Clear Expo cache:**
```bash
npx expo start -c
```

3. **Check your internet connection** on the device/emulator

4. **For Android Emulator:**
   - Make sure you have internet access
   - Try restarting the emulator

5. **Check CORS on backend:**
   - Your backend should allow requests from your mobile app
   - Check that CORS headers are properly configured

### If using localhost for development:

For Android Emulator:
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

For iOS Simulator:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

For Physical Device (replace with your computer's IP):
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000
```

## Files Modified

1. `config/api.config.ts` - New centralized API configuration
2. `app.json` - Added API URL to extra config
3. `app/(authorized)/(tabs)/index.tsx` - Updated to use centralized config
4. `app/(authorized)/products/index.tsx` - Updated to use centralized config
5. `app/(authorized)/products/[id].tsx` - Updated to use centralized config
6. `app/(authorized)/categories/index.tsx` - Updated to use centralized config
7. `app/(authorized)/categories/[name].tsx` - Updated to use centralized config

All files now import and use `API_BASE_URL` from `@/config/api.config`

## Next Steps

1. Restart your development server with cache clear:
   ```bash
   npx expo start -c
   ```

2. The error should be resolved and your app should now connect to your Render backend!

3. If you still have issues, check:
   - Backend is accessible at https://woocommerce-1dee.onrender.com
   - Products endpoint returns data: https://woocommerce-1dee.onrender.com/api/products
   - Your internet connection is working

