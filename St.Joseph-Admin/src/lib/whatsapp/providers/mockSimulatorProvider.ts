import { IWhatsAppProvider } from "../providerInterface";
import { SendWhatsAppPayload, WhatsAppProviderResponse, NotificationSettings } from "../types";
import { formatPhoneNumber } from "../templateEngine";

export class MockSimulatorProvider implements IWhatsAppProvider {
  name = "Mock";

  async sendMessage(payload: SendWhatsAppPayload, _settings: NotificationSettings): Promise<WhatsAppProviderResponse> {
    const formattedPhone = formatPhoneNumber(payload.to);

    // Simulate network delay
    await new Promise((res) => setTimeout(res, 400));

    if (!formattedPhone || formattedPhone.length < 10) {
      return {
        success: false,
        errorMessage: "Invalid parent mobile phone number. E.164 verification failed."
      };
    }

    const mockId = `mock_wa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.info(`[WhatsApp Simulator Provider] Message delivered to ${formattedPhone}:`, payload.message);

    return {
      success: true,
      providerMessageId: mockId,
      rawResponse: {
        status: "delivered",
        timestamp: new Date().toISOString(),
        recipient: formattedPhone,
        simulated: true
      }
    };
  }
}
