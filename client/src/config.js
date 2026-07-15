// Central API base URL for the whole frontend.
// Configured via Vite env (client/.env → VITE_API_URL). Falls back to the
// local Postgres backend for development.
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
