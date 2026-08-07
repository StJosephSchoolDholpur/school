import { IWhatsAppProvider } from "../providerInterface";
import { SendWhatsAppPayload, WhatsAppProviderResponse, NotificationSettings } from "../types";
import { formatPhoneNumber } from "../templateEngine";

export class OpenWAProvider implements IWhatsAppProvider {
  name = "OpenWA";

  async sendMessage(payload: SendWhatsAppPayload, settings: NotificationSettings): Promise<WhatsAppProviderResponse> {
    const creds = settings.api_credentials || {};
    const baseUrl = (creds.openwa_api_url || "http://localhost:2785").replace(/\/$/, "");
    const apiKey = creds.openwa_api_key || "";
    let targetSession = (creds.openwa_session_id || "").trim();

    // Clean phone number format for WhatsApp (e.g. 919928623387@c.us)
    const digitsOnly = formatPhoneNumber(payload.to).replace("+", "");
    const chatId = digitsOnly.endsWith("@c.us") ? digitsOnly : `${digitsOnly}@c.us`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    if (apiKey) {
      headers["X-API-Key"] = apiKey;
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    // Auto-resolve active OpenWA session if not explicitly set or to self-heal
    try {
      const listSessionsUrl = baseUrl.endsWith("/api") ? `${baseUrl}/sessions` : `${baseUrl}/api/sessions`;
      const sRes = await fetch(listSessionsUrl, { method: "GET", headers });
      if (sRes.ok) {
        const sData = await sRes.json();
        const list: any[] = Array.isArray(sData) ? sData : (sData.data || sData.items || []);
        if (list.length > 0) {
          const activeSess = list.find((s) => 
            s.status === "CONNECTED" || 
            s.status === "WORKING" || 
            s.status === "READY" || 
            s.state === "CONNECTED"
          ) || list[0];
          
          if (activeSess) {
            targetSession = activeSess.id || activeSess.name || targetSession;
          }
        }
      }
    } catch (e) {
      console.warn("Could not auto-fetch OpenWA sessions, using targetSession fallback:", e);
    }

    if (!targetSession) {
      targetSession = "default";
    }

    try {
      // Build API endpoint URL
      const apiEndpoint = baseUrl.endsWith("/api")
        ? `${baseUrl}/sessions/${targetSession}/messages/send-text`
        : `${baseUrl}/api/sessions/${targetSession}/messages/send-text`;

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          chatId,
          text: payload.message
        })
      });

      const json = await res.json();
      if (res.ok && (json.id || json.status === "SUCCESS" || json.success !== false)) {
        return {
          success: true,
          providerMessageId: json.id || json.messageId || `openwa_${Date.now()}`,
          rawResponse: json
        };
      } else {
        return {
          success: false,
          errorMessage: json.message || json.error || `OpenWA error for session '${targetSession}'`,
          rawResponse: json
        };
      }
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || "Failed to connect to OpenWA Gateway instance. Ensure OpenWA is running."
      };
    }
  }
}
