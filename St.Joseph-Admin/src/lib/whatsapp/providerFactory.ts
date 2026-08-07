import { IWhatsAppProvider } from "./providerInterface";
import { WhatsAppProviderType } from "./types";
import { MetaCloudProvider } from "./providers/metaCloudProvider";
import { OpenWAProvider } from "./providers/openWaProvider";
import { WatiProvider } from "./providers/watiProvider";
import { AiSensyProvider } from "./providers/aisensyProvider";
import { InteraktProvider } from "./providers/interaktProvider";
import { TwilioProvider } from "./providers/twilioProvider";
import { MockSimulatorProvider } from "./providers/mockSimulatorProvider";

export function getWhatsAppProvider(type: WhatsAppProviderType): IWhatsAppProvider {
  switch (type) {
    case "OpenWA":
      return new OpenWAProvider();
    case "Meta":
      return new MetaCloudProvider();
    case "WATI":
      return new WatiProvider();
    case "AiSensy":
      return new AiSensyProvider();
    case "Interakt":
      return new InteraktProvider();
    case "Twilio":
      return new TwilioProvider();
    case "Mock":
    default:
      return new MockSimulatorProvider();
  }
}
