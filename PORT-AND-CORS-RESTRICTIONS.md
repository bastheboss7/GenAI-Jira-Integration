# Port and CORS Restrictions in Local Development

## Where to Change Ports

You may need to change the port in several places to ensure your frontend and backend communicate correctly:

### 1. Frontend Dev Server Port
- **File:** `frontend/vite.config.ts`
- **Code:**
  ```js
  export default defineConfig({
    server: {
      port: 5173, // <--- Change this if you want a different frontend port
    }
  })
  ```

### 2. Backend CORS Allowed Origin
- **File:** `.env`
- **Key:** `CORS_ORIGIN`
- **Example:**
  ```env
  CORS_ORIGIN=http://localhost:5173
  ```
  If you use a custom CORS logic, see backend code below.

### 3. Backend CORS Middleware (if using custom logic)
- **File:** `backend/src/server.ts`
- **Code Example:**
  ```js
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ];
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
  ```

### 4. Frontend API Base URL (if overridden)
- **File:** `frontend/.env` or in code
- **Key:** `VITE_API_BASE_URL`
- **Example:**
  ```env
  VITE_API_BASE_URL=http://localhost:8090/api
  ```

### 5. Backend Server Port
- **File:** `.env`
- **Key:** `PORT`
- **Example:**
  ```env
  PORT=8090
  ```

---

## Problem

When running a frontend (React/Vite) and backend (Node/Express) locally, you may encounter CORS errors if the frontend and backend run on different ports. Browsers enforce CORS (Cross-Origin Resource Sharing) to prevent security issues, but this can block API calls between your frontend and backend during development.

## Common CORS Error

```
Access to fetch at 'http://localhost:8090/api/...' from origin 'http://localhost:5175' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header contains multiple values 'http://localhost:5173,http://localhost:5174,http://localhost:5175', but only one is allowed.
```

## Why This Happens

- The backend sets the `Access-Control-Allow-Origin` header to a comma-separated list of allowed origins (e.g., `http://localhost:5173,http://localhost:5174`).
- **Browsers do not support multiple origins in this header.** Only a single origin value is allowed.
- If the frontend runs on a port not listed, or if the backend sends multiple origins, the browser blocks the request.

## How to Avoid This

1. **Run the frontend on a fixed port** (e.g., 5173) and set `CORS_ORIGIN` in `.env` to that port only:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```
2. **If you need to support multiple ports during development:**
   - Update your backend CORS logic to dynamically echo back the `Origin` header if it matches a whitelist, instead of sending a comma-separated list.
   - Example (Express):
     ```js
     const allowedOrigins = [
       'http://localhost:5173',
       'http://localhost:5174',
       'http://localhost:5175'
     ];
     app.use(cors({
       origin: (origin, callback) => {
         if (!origin || allowedOrigins.includes(origin)) {
           callback(null, origin);
         } else {
           callback(new Error('Not allowed by CORS'));
         }
       },
       credentials: true
     }));
     ```

3. **If you see port conflicts:**
   - Stop any process using the port (e.g., `lsof -i :5173` then `kill <PID>`).
   - Restart your frontend so it uses the intended port.

## Summary
- Only one value is allowed in `Access-Control-Allow-Origin`.
- Use a fixed frontend port, or update backend CORS logic to echo the request's origin if it's allowed.
- Restart servers after changing ports or CORS settings.

---

For more, see: [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
