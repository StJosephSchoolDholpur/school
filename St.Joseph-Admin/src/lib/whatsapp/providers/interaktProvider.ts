import { IWhatsAppProvider } from "../providerInterface";
import { SendWhatsAppPayload, WhatsAppProviderResponse, NotificationSettings } from "../types";
import { formatPhoneNumber } from "../templateEngine";

export class InteraktProvider implements IWhatsAppProvider {
  name = "Interakt";

  async sendMessage(payload: SendWhatsAppPayload, settings: NotificationSettings): Promise<WhatsAppProviderResponse> {
    const creds = settings.api_credentials || {};
    const apiKey = creds.interakt_api_key;

    if (!apiKey) {
      return {
        success: false,
        errorMessage: "Interakt API Key missing in Notification Settings."
      };
    }

    const recipientPhone = formatPhoneNumber(payload.to).replace("+", "");

    try {
      const url = "https://api.interakt.ai/v1/public/message/";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          countryCode: "+91",
          phoneNumber: recipientPhone.slice(-10),
          type: "Template",
          template: {
            name: payload.templateName || "birthday_wish",
            languageCode: "en"
          }
        })
      });
      const json = await res.json();
      if (res.ok && json.result) {
        return {
          success: true,
          providerMessageId: json.id || `interakt_${Date.now()}`,
          rawResponse: json
        };
      }
      return {
        success: false,
        errorMessage: json.message || "Interakt API delivery failed.",
        rawResponse: json
      };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || "Failed to reach Interakt server."
      };
    }
  }
}
