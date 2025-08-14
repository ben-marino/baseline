# Firebase Bindings

File: `src/firebase.ts`

Exports:
- `firebase`: initialized Firebase app
- `auth`: `Auth` instance (uses `initializeAuth` with `indexedDBLocalPersistence` on native, `getAuth()` on web)
- `storage`: Firebase Storage instance
- `db`: Realtime Database instance
- `signOutAndCleanUp()`: clears local app state and signs out

## signOutAndCleanUp
Clears:
- IndexedDB `ldb.logs`
- `localStorage`: `keys`, `ekeys`, `settings`, `autosave`, `eautosave`, `lastShown`, `offline`, `onboarding`
- `sessionStorage`: `pwd`
- On iOS, removes `keys` and `refreshToken` from shared user defaults via `WidgetsBridgePlugin`
- Calls `FirebaseAuthentication.signOut()` and `signOut(auth)`

Example:
```ts
import { signOutAndCleanUp } from '@/firebase';

// On key or decryption failures
signOutAndCleanUp();
```