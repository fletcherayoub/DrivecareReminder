# Drivecare

Your intelligent vehicle maintenance and expense management companion. Track your vehicle's lifecycle, road taxes, services, and fuel consumption with ease.

## ✨ Key Features

- **Vehicle Lifecycle Management**:
  - Add and manage multiple vehicles (cars, bikes, trucks).
  - Track registration, insurance, and inspection renewal dates.
  - Set custom reminders for important dates with notification support.
  - Upload and store vehicle-related documents securely.

- **Maintenance Tracking**:
  - Log detailed service records with costs and dates.
  - Set reminders for upcoming services based on time or kilometers.
  - View complete service history for each vehicle.

- **Fuel Management**:
  - Track fuel expenses and liters/gallons consumed.
  - Calculate fuel efficiency (km/l or mpg) automatically.
  - Monitor fuel spending trends.

- **Financial Overview**:
  - Track all vehicle-related expenses in one place.
  - View cost breakdowns by category (fuel, service, insurance, etc.).
  - Get a clear picture of your total vehicle spending.

- **Smart Reminders & Notifications**:
  - Push notifications for upcoming due dates.
  - Customizable reminder intervals.
  - Snooze or repeat reminders as needed.

## 📂 Project Structure

- `app/`: Main application screens organized by feature.
  - `(tabs)/`: Core feature tabs (Home, Vehicles, Expenses, Fuel, Settings).
- `store/`: Redux Toolkit store for state management.
  - `mmkv.ts`: Fast key-value storage using MMKV.
  - `vehicleStore.ts`: Manages vehicle data and state.
  - `expenseStore.ts`: Handles expense tracking.
  - `fuelStore.ts`: Manages fuel logs and efficiency calculations.
  - `reminderStore.ts`: Manages maintenance and document reminders.
  - `documentStore.ts`: Manages document storage and retrieval.
- `components/`: Reusable UI components.
- `utils/`: Utility functions and helpers.
- `constants/`: App constants and color definitions.
- `assets/`: Static assets like images and fonts.

## 🛠️ Getting Started

### Prerequisites
- Node.js (LTS recommended)
- Expo CLI installed globally (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DrivecareReminder
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npx expo start
```

### Development Commands

- Start development server: `npx expo start`
- Start with Android emulator: `npx expo run:android`
- Start with iOS simulator: `npx expo run:ios`
- Run tests: `npm test`

## 🚀 Building for Production

### Android

**App Bundle (Google Play)**:
```bash
npx expo export:platform android --platform-specific-options {"android": {"buildType": "app-bundle"}}
```

**APK (Direct Install)**:
```bash
npx expo export:platform android --platform-specific-options {"android": {"buildType": "apk"}}
```

### iOS

```bash
npx expo build:ios --clear-cache
```

## 📝 License

This project is licensed under the [MIT License](LICENSE).