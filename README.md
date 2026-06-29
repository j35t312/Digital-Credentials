# Digital Credentials Wallet Browser 📱💳

A lightweight, local-first **React + TypeScript Progressive Web App (PWA)** designed to parse, unzip, and browse Apple Wallet (`.pkpass`) digital credentials directly within your web browser. 

This wallet operates entirely on the client side, utilizing standard web APIs to read package data, process embedded metadata, and render native-looking barcodes and QR codes for offline scanning.

## ✨ Features

* **Local `.pkpass` Parsing:** Unzips and parses Apple Wallet pass bundles entirely within your browser using `jszip`. No data ever leaves your device.
* **Dynamic Barcode Generation:** Renders custom barcodes and QR codes embedded in passes using `bwip-js`.
* **Progressive Web App (PWA):** Installable on iOS, Android, and desktop platforms with full offline availability via `vite-plugin-pwa`.
* **TypeScript Native:** Built with modern TypeScript for robust type safety across pass schemas.
* **Vite-Powered:** Fast Refresh development and highly optimized production builds using Vite 8.

## 🛠️ Tech Stack

* **Framework:** React 19 (Modern functional components, Hooks)
* **Language:** TypeScript 5.9+
* **Build Tool & Bundler:** Vite 8
* **PWA Engine:** `vite-plugin-pwa`
* **Core Libraries:**
  * `jszip` (^3.10.1) — For client-side extraction of compressed `.pkpass` containers.
  * `bwip-js` (^4.7.0) — For accurate, high-fidelity rendering of barcode/QR types (QR Code, Aztec, PDF417, Code 128) specified by the Apple Wallet format.

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+ recommended) and **npm** installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/digital-credentials-wallet.git
   cd digital-credentials-wallet
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Scripts

Run the following npm commands for development, building, and previewing:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the local development server with Vite hot reloading. |
| `npm run build` | Runs TypeScript compilation checking (`tsc --noEmit`) and builds an optimized, production-ready static asset bundle in the `dist/` directory. |
| `npm run preview` | Locally serves the production build folder for verification. |

## 📦 Architecture & Working Principle

1. **Upload / Drop:** The user drops or selects a `.pkpass` file.
2. **Decompression:** `jszip` extracts the file in memory, separating the core `pass.json`, localization strings, and asset graphics (`icon.png`, `logo.png`, `strip.png`).
3. **Data Mapping:** The application matches the extracted payload against standard Apple Wallet Pass keys (e.g., `boardingPass`, `coupon`, `eventTicket`, `generic`, `storeCard`).
4. **Barcode Processing:** The nested `barcodes` dictionary is evaluated, and `bwip-js` draws the corresponding symbology to an HTML5 canvas for reliable hardware scanning.

## 📄 License

This project is licensed under the **ISC License**. See the `package.json` file for details.

---

🧑‍💻 Author & Maintenance
Author: Roel Rivera
GitHub Repository: n-Cycle_Weeks
Contact Email: r2psycho@gmail.com
Copyright: Copyright © 2023-2026 by j35t312