# Backend Endpoints

Base URL: `https://api.getbaseline.app`

Authentication: All endpoints require `Authorization: Bearer <Firebase ID Token>` header, except where noted.
Content-Type: `application/json` unless noted.

## Health
- GET `/` → 200 OK text "baseline API up and running."

## PDP (Personal Data Protection)

### POST `/pdp/enable`
Enable PDP protection with a passphrase.
- Body: `{ passphrase: string(min 6) }`
- Responses: `200` on success, `400` validation

### POST `/pdp/disable`
Disable PDP protection.
- Body: `{ passphrase: string(min 6) }`
- Responses: `200` on success, `400` validation

### POST `/pdp/change`
Change PDP passphrase.
- Body: `{ oldPassphrase: string(min 6), newPassphrase: string(min 6) }`
- Responses: `200` on success, `400` validation

## Accounts

### POST `/accounts/getOrCreateKeys`
Create or return encryption keys and basic account metadata.
- Body:
  - `credential`: `{ providerId: 'google.com' | 'apple.com' | 'anonymous', accessToken?: string }`
  - For Apple without `accessToken`: `{ visibleKey: string, encryptedKey: string }`
  - `platform`: `'ios' | 'android' | 'web'`
  - Optional: `passphrase` if PDP enabled
- Responses:
  - `200` JSON: `{ visibleKey, encryptedKey, encryptedKeyVisible, additionalData: { offline, onboarded, beginner, introQuestions } }` or returns stored keys for existing users
  - `428` missing required Google drive scopes
  - `400/406` validation errors

### POST `/accounts/delete`
Delete user account and all associated data.
- Body: `{}`
- Responses: `200` on success

### POST `/accounts/sync`
Sync device/platform, timezone offset, FCM tokens, and coarse geolocation.
- Body may include:
  - `offset`: number (−1000..1000)
  - `platform`: `'ios' | 'android' | 'web'`
  - `deviceId`: string, `fcmToken`: string
- Responses: `200` on success

## Analytics

### POST `/analytics/beacon`
First-party conversion analytics.
- Body:
  - `fingerprint`: number (client-side murmur fingerprint)
  - `state`: `'visited' | 'install_started' | 'signed_up'`
  - Optional: `utm_source`, `utm_campaign`, `uid` (required if `state==='signed_up'`)
- Responses: `200` on success; `400/403` validation errors

## Main

### POST `/survey`
Store survey result.
- Body: `{ key: 'dassv1'|'edev1'|'harmv1'|'cagev1'|'spfv1'|'wastv1', results: number | object, keys: { visibleKey, encryptedKeyVisible } }`
- Validation:
  - Type and bounds validated per survey key
- Responses: `200` on success; `400` validation

### POST `/moodLog` (multipart/form-data)
Create or edit a mood log, with optional images/audio and SociallyFed fields.
- Form fields:
  - `keys`: `{ visibleKey, encryptedKeyVisible }` (JSON string)
  - `mood`: integer −5..5
  - `journal`: string (≤ 25000 chars)
  - `average`: `'below'|'average'|'above'`
  - Optional scheduling/editing: `editTimestamp` (int), `addFlag` (`summary:ISODate`), `timezone`
  - Optional media: `file` (≤ 3 images, any common type), `audio` (single file)
  - Optional song: `song` like `spotify:track:...`
  - Optional SociallyFed data:
    - `virtueAlignment` with virtues and optional context
    - `mediaConsumption` minutes per level, optional mood/time fields
    - `patterns` arrays, confidence, category, optional flags
    - `cybernetics` goal progress and arrays
    - `promptMetadata` category and flags
    - `emotionalRegulation` techniques/effectiveness/triggers/strategies
    - `goalProgress` goals array and overall
- Responses: `200` on success; detailed `400` messages on validation failure

### POST `/getImage`
Retrieve an image by filename.
- Body: `{ keys, filename }`
- Response: `data:image/webp;base64,...` or decrypted content if `.enc`

### POST `/getAudio`
Retrieve audio associated with a log.
- Body: `{ keys, filename }`
- Response: `audio/mp3` buffer

## Gap Fund

### POST `/gap`
Submit a Gap Fund request.
- Body: `{ email, need, amount, method, location, zone, keys }`
- Notes: Requires at least 8 distinct journaling days out of the last 18.
- Responses: `200` on success; `400` with message on qualifying failure

## Streak

### POST `/streak`
Calculate journaling streak and danger level.
- Body: `{ keys, currentDate: ISO string }`
- Response: `{ streak: number, danger: 0|1|2|3, entriesToday: number }`

## Spotify

### POST `/spotify/search`
Search Spotify tracks with client credentials flow.
- Body: `{ query: string }`
- Response: Spotify search JSON

---

Example: Fetch streak

```bash
curl -X POST \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  https://api.getbaseline.app/streak \
  -d '{
    "keys": { "visibleKey": "...", "encryptedKeyVisible": "..." },
    "currentDate": "2025-01-01T00:00:00.000Z"
  }'
```