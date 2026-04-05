/**
 * Dynamically resolves the API Base URL.
 * If accessed via localhost, returns localhost.
 * If accessed via network IP (mobile), returns that IP.
 */
export const getApiBaseUrl = () => {
    if (typeof window === "undefined") return "http://localhost:3001";
    const hostname = window.location.hostname;
    // If it's localhost or an IP, keep it. This allows mobile to reach the desktop IP.
    return `http://${hostname}:3001`;
};
