# ⏱️ PikoMo Multi-Timer CountDown
[![Deploy to GitHub Pages](https://github.com/pikomonde/pkmo-timer/actions/workflows/deploy-github-pages.yml/badge.svg)](https://github.com/pikomonde/pkmo-timer/actions/workflows/deploy-github-pages.yml)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

A robust, simple countdown timer built with React and focused on clean architecture. Featuring automated CI/CD and unit-tested business logic.

## ✨ Features
- **Multi-Timer Management**: Run and manage multiple timers simultaneously.
- **Sound Manager**: Decoupled audio logic for reliable alarm notifications.
- **Responsive UI**: Styled with CSS Modules for encapsulated and clean design.
- **Reliable Logic**: Core utilities are unit-tested with Vitest.
- **Automated Deployment**: Built and deployed automatically via GitHub Actions.

## 🛠️ Tech Stack
- **Frontend**: React (Vite)
- **Styling**: CSS Modules, Clsx
- **State Management**: Custom Hooks (Functional Logic)
- **Testing**: Vitest
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/pikomonde/pkmo-timer.git
   ```
2. **Install Dependencies**
   ```bash
   cd app/pkmo-timer
   npm install
   ```
3. **Run Unit Tests**
   ```bash
   npm test
   ```
4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture Note
This project follows a "Logic-UI Separation" pattern. Business logic (conversions, object factories) lives in utils, while React components focus purely on rendering and user interaction.

## ❤️ Support My Work

If this project helped you, consider supporting its development:

| Platform | Link/Address |
| :--- | :--- |
| **Global (USD)** | [Support via Ko-fi](https://ko-fi.com/pikomonde) |
| **USDT (BSC/Base)** | `0xB7Bb8aBC788660B380E6F4E0Be28dd5CB20eC32c` (BEP-20 / Base Network) |
| **SOL (Solana)** | `HbZ7iYDWL5a19c4Wmkzd4jfp2yU9B6MHfbBJ6tXyn685` |

> *Every coffee fuels more code and better documentation!*
