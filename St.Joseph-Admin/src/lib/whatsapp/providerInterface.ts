import { SendWhatsAppPayload, WhatsAppProviderResponse, NotificationSettings } from "./types";

export interface IWhatsAppProvider {
  name: string;
  sendMessage(payload: SendWhatsAppPayload, settings: NotificationSettings): Promise<WhatsAppProviderResponse>;
}
