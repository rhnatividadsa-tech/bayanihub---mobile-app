# 🦸‍♂️ BayaniHub Mobile App

Welcome to the **BayaniHub Mobile App** repository! This is a React Native mobile application built with **Expo** and **TypeScript**. It serves as the mobile companion to the BayaniHub platform, allowing users to pledge donations and register as volunteers for disaster response and relief efforts.

---

## 📋 Prerequisites

Before you clone and run this project, make sure you have the following installed on your machine:

1. **[Node.js](https://nodejs.org/)** (LTS version recommended)
2. **[Git](https://git-scm.com/)**
3. **A Code Editor** (We highly recommend [Visual Studio Code](https://code.visualstudio.com/))
4. **An Emulator or Physical Device**:
   * **Android**: Install [Android Studio](https://developer.android.com/studio) and set up an Android Emulator.
   * **iOS (Mac only)**: Install Xcode from the Mac App Store and set up an iOS Simulator.
   * **Physical Device**: Download the **Expo Go** app from the Google Play Store or Apple App Store.

---

## 🚀 Getting Started

Follow these steps to get the project running locally on your machine.

### 1. Clone the repository
Open your terminal and clone the project to your local machine:
```bash
git clone <YOUR_GITHUB_REPO_URL_HERE>
2. Navigate to the project directory
Bash
cd BayaniHubMobile
3. Install dependencies
Install all the required packages using npm:

Bash
npm install
📱 Running the App
Once your dependencies are installed, you can start the local Expo development server.

1. Start the Expo Server
Run the following command in your terminal:

Bash
npx expo start
Note: This will open a Metro Bundler interface in your terminal and display a large QR code.

2. Open the App on your preferred device:
For Android Emulator: Press a in the terminal.

For iOS Simulator: Press i in the terminal (Mac only).

For Physical Phone: Open the Expo Go app on your phone and scan the QR code displayed in the terminal.

📁 Project Structure
This project uses Expo Router for file-based navigation.

Plaintext
BayaniHubMobile/
├── app/                  # Main application screens (Routing)
│   ├── index.tsx         # Homepage
│   ├── pledge.tsx        # Pledge Donation Screen
│   └── volunteer.tsx     # Volunteer Registration Screen
├── assets/               # Images, fonts, and icons
├── declarations.d.ts     # TypeScript declarations for assets/routing
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
🛠️ Troubleshooting & Common Issues
1. "White Screen" or App not updating
If the emulator shows a white screen or doesn't reflect your latest code changes, the Expo cache might be stuck. Stop the server (Ctrl + C) and run the clean start command:

Bash
npx expo start -c

2. Red Squiggly Lines under expo-router in VS Code
Because this project uses strict TypeScript, VS Code sometimes takes a moment to recognize the routing types. This is usually a "ghost error" if the app still runs fine on the emulator.

The Fix: Press Ctrl + Shift + P (or Cmd + Shift + P on Mac), type Restart TS Server, and hit Enter.

3. Image Import Errors
If TypeScript complains that it cannot find image modules (e.g., Cannot find module '../assets/logo.png'), ensure that the declarations.d.ts file exists in the root directory and contains:

TypeScript
declare module "*.png";
declare module "*.jpg";
declare module "expo-router";