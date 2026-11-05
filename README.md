# Thikana

> *Jahan dost milte hain* — Social gaming app for India.

---

## 1. Tooling & Architecture Choices

- **Node.js**: `v24.22.0+`
- **Monorepo Manager**: `npm workspaces` (`apps/*`, `packages/*`)
- **TypeScript**: `5.7+` across all workspaces
- **Backend API (`apps/api`)**: Node.js + Express (TypeScript), server-authoritative logic.
- **Mobile (`apps/mobile`)**: **Bare React Native CLI** (`react-native`), Android-first (no Expo).
- **Shared Package (`packages/shared`)**: Shared TypeScript types (`HealthResponse`, `ApiErrorResponse`, etc.) consumed directly by both backend and mobile.

---

## 2. Directory Structure

```
thikana/
├── apps/
│   ├── api/                 # Express + TypeScript backend
│   │   ├── .env.example     # Environment variable template
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts     # Health endpoint, Request ID, Error middleware
│   └── mobile/              # Bare React Native CLI mobile app (Android first)
│       ├── .env.example     # Mobile environment variable template
│       ├── package.json
│       ├── tsconfig.json
│       ├── app.json
│       ├── index.js
│       └── App.tsx          # Health check test screen
├── packages/
│   └── shared/              # Shared TypeScript contracts and types
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts     # HealthResponse, ApiError, ApiErrorResponse
├── .gitignore
├── package.json             # Root npm workspace configuration
└── README.md
```

---

## 3. Getting Started

### 3.1 Install Dependencies

From the repository root:

```bash
npm install
```

### 3.2 Configure Environment Variables

Create `.env` in `apps/api`:

```bash
cp apps/api/.env.example apps/api/.env
```

Create `.env` in `apps/mobile`:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

---

## 4. Running Locally

### 4.1 Running the Backend API (`apps/api`)

From the root:

```bash
npm run dev:api
```

Or from `apps/api`:

```bash
cd apps/api
npm run dev
```

The API starts on `http://localhost:3000`.

- **Health check endpoint**: `GET http://localhost:3000/v1/health`
- **Response**: `{"status":"ok"}`

### 4.2 Running the Mobile App (`apps/mobile`)

From the root:

1. **Start the Metro bundler**:
   ```bash
   npm run start:mobile
   ```

2. **Launch on Android Emulator / Connected Device**:
   ```bash
   npm run android:mobile
   ```

*Note: In the Android emulator, `http://10.0.2.2:3000` automatically maps to the host machine's `http://localhost:3000`.*

---

## 5. API Response Contracts

### Health Endpoint
`GET /v1/health`
```json
{
  "status": "ok"
}
```

### Standard Error Shape (Rule 6)
All error responses adhere to:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Cannot GET /unknown",
    "request_id": "b3e34346-6019-48fb-bfa9-43c2c770cfa5"
  }
}
```
Headers returned include `x-request-id`.
