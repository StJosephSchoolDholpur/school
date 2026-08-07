import { IWhatsAppProvider } from "../providerInterface";
import { SendWhatsAppPayload, WhatsAppProviderResponse, NotificationSettings } from "../types";
import { formatPhoneNumber } from "../templateEngine";

export class MetaCloudProvider implements IWhatsAppProvider {
  name = "Meta";

  async sendMessage(payload: SendWhatsAppPayload, settings: NotificationSettings): Promise<WhatsAppProviderResponse> {
    const creds = settings.api_credentials || {};
    const phoneId = creds.meta_phone_number_id;
    const token = creds.meta_access_token;

    if (!phoneId || !token) {
      return {
        success: false,
        errorMessage: "Meta WhatsApp Cloud API credentials (Phone Number ID or Access Token) missing in Notification Settings."
      };
    }

    const recipientPhone = formatPhoneNumber(payload.to).replace("+", "");

    try {
      const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
      const bodyPayload = payload.templateName
        ? {
            messaging_product: "whatsapp",
            to: recipientPhone,
            type: "template",
            template: {
              name: payload.templateName,
              language: { code: "en_US" }
            }
          }
        : {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipientPhone,
            type: "text",
            text: { body: payload.message }
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyPayload)
      });

      const json = await res.json();
      if (res.ok && json.messages?.[0]?.id) {
        return {
          success: true,
          providerMessageId: json.messages[0].id,
          rawResponse: json
        };
      } else {
        return {
          success: false,
          errorMessage: json.error?.message || "Meta API returned an error.",
          rawResponse: json
        };
      }
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || "Network failure connecting to Meta Cloud API."
      };
    }
  }
}
