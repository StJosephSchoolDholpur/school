// API Configuration for St. Joseph TC Portal Backend (Render / Supabase)

export const API_CONFIG = {
  // Base URL of the Render TC Backend
  BASE_URL: (import.meta.env.VITE_TC_API_URL || "https://tc.stjosephschooldholpur.com").replace(/\/$/, ""),
  
  ENDPOINTS: {
    SEARCH_TC: "/api/tc",
    VIEW_PDF: "/api/tc/view",
  },
};
