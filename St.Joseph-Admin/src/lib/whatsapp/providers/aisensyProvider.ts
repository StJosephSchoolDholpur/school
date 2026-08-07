import { IWhatsAppProvider } from "../providerInterface";
import { SendWhatsAppPayload, WhatsAppProviderResponse, NotificationSettings } from "../types";
import { formatPhoneNumber } from "../templateEngine";

export class AiSensyProvider implements IWhatsAppProvider {
  name = "AiSensy";

  async sendMessage(payload: SendWhatsAppPayload, settings: NotificationSettings): Promise<WhatsAppProviderResponse> {
    const creds = settings.api_credentials || {};
    const apiKey = creds.aisensy_api_key;

    if (!apiKey) {
      return {
        success: false,
        errorMessage: "AiSensy API Key missing in Notification Settings."
      };
    }

    const recipientPhone = formatPhoneNumber(payload.to).replace("+", "");

    try {
      const url = "https://backend.aisensy.com/campaign/t1/api/v2";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          campaignName: payload.templateName || "birthday_wish",
          destination: recipientPhone,
          userName: payload.recipientName || "Parent",
          templateParams: payload.variables ? Object.values(payload.variables) : []
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return {
          success: true,
          providerMessageId: json.model?._id || `aisensy_${Date.now()}`,
          rawResponse: json
        };
      }
      return {
        success: false,
        errorMessage: json.message || "AiSensy API error.",
        rawResponse: json
      };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || "Connection error to AiSensy gateway."
      };
    }
  }
}
