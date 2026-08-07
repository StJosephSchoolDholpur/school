import { IWhatsAppProvider } from "../providerInterface";
import { SendWhatsAppPayload, WhatsAppProviderResponse, NotificationSettings } from "../types";
import { formatPhoneNumber } from "../templateEngine";

export class WatiProvider implements IWhatsAppProvider {
  name = "WATI";

  async sendMessage(payload: SendWhatsAppPayload, settings: NotificationSettings): Promise<WhatsAppProviderResponse> {
    const creds = settings.api_credentials || {};
    const endpoint = creds.wati_api_endpoint;
    const token = creds.wati_access_token;

    if (!endpoint || !token) {
      return {
        success: false,
        errorMessage: "WATI credentials (API Endpoint or Bearer Token) missing in Notification Settings."
      };
    }

    const recipientPhone = formatPhoneNumber(payload.to).replace("+", "");

    try {
      const url = `${endpoint.replace(/\/$/, "")}/api/v1/sendSessionMessage/${recipientPhone}?messageText=${encodeURIComponent(payload.message)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const json = await res.json();
      if (res.ok && (json.result || json.validWhatsAppNumber)) {
        return {
          success: true,
          providerMessageId: json.ticketId || `wati_${Date.now()}`,
          rawResponse: json
        };
      }
      return {
        success: false,
        errorMessage: json.info || "WATI API request failed.",
        rawResponse: json
      };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || "Network error connecting to WATI server."
      };
    }
  }
}
