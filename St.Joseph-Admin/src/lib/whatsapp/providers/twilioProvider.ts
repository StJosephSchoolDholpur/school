import { IWhatsAppProvider } from "../providerInterface";
import { SendWhatsAppPayload, WhatsAppProviderResponse, NotificationSettings } from "../types";
import { formatPhoneNumber } from "../templateEngine";

export class TwilioProvider implements IWhatsAppProvider {
  name = "Twilio";

  async sendMessage(payload: SendWhatsAppPayload, settings: NotificationSettings): Promise<WhatsAppProviderResponse> {
    const creds = settings.api_credentials || {};
    const sid = creds.twilio_account_sid;
    const token = creds.twilio_auth_token;
    const fromNumber = creds.twilio_from_number || "whatsapp:+14155238886";

    if (!sid || !token) {
      return {
        success: false,
        errorMessage: "Twilio Account SID or Auth Token missing in Notification Settings."
      };
    }

    const recipient = `whatsapp:${formatPhoneNumber(payload.to)}`;

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
      const formData = new URLSearchParams();
      formData.append("From", fromNumber);
      formData.append("To", recipient);
      formData.append("Body", payload.message);

      const authHeader = "Basic " + btoa(`${sid}:${token}`);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const json = await res.json();
      if (res.ok && json.sid) {
        return {
          success: true,
          providerMessageId: json.sid,
          rawResponse: json
        };
      }
      return {
        success: false,
        errorMessage: json.message || "Twilio WhatsApp API error.",
        rawResponse: json
      };
    } catch (err: any) {
      return {
        success: false,
        errorMessage: err.message || "Twilio gateway connection failed."
      };
    }
  }
}
