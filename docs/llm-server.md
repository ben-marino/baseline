# Example LLM Server

File: `llm-server-example/server.js`

Endpoints:
- GET `/health`: returns `{ status, version, capabilities[], load, uptime }`
- POST `/analyze`: body `{ encryptedData, requestId, timestamp, dataType: 'journal'|'patterns'|'virtues'|'media', version }`, returns `{ success, encryptedInsights, processingTime, timestamp }`
- GET `/config`: returns server config and supported features
- GET `/status`: returns status, uptime, memory, load

Notes:
- This is a mock server; encryption is simulated with base64 for the example.
- `LLMService` discovers this on localhost common ports and interacts via `/health` and `/analyze`.

Run:
```bash
node llm-server-example/server.js
```