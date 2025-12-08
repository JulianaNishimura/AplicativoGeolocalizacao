# GeoApp

This is a simple GPS-like mobile app built with Expo.

## Prerequisites

-   Node.js and npm installed
-   Expo Go app installed on your mobile device

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Add Your Google Maps API Key:**
    -   Open `src/config.js`.
    -   Follow the instructions in the file to obtain a Google Maps API key.
    -   Paste your API key into the `API_KEY` constant.

3.  **Run the App:**
    -   To run the app and get a scannable QR code for the Expo Go app, use the following command:
        ```bash
        npm run start:tunnel
        ```
    -   This will start the Expo development server in tunnel mode, which is required for the QR code to work on a physical device.

4.  **Scan the QR Code:**
    -   Open the Expo Go app on your mobile device.
    -   Scan the QR code displayed in the terminal.
    -   The app will now open on your device.

## Troubleshooting

If you encounter a "failed to download remote update" error in the Expo Go app, try clearing the cache:

1.  Open the Expo Go app on your device.
2.  Long-press on the `GeoApp` project.
3.  Select "Clear Cache".
4.  Restart the development server (`npm run start:tunnel`) and scan the new QR code.
