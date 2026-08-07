import { registerCapabilities } from '@reticlehq/react';

if (import.meta.env.DEV) {
  registerCapabilities({
    testids: [
      'tc-search-input',
      'tc-lookup-btn',
      'nav-home',
      'nav-academics',
      'nav-mandatory-disclosure',
    ],
    signals: [],
    stores: [],
  });
}
