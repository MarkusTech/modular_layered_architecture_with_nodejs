import { RippleAPI } from 'ripple-lib';

export const rippleAPI = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Testnet
});

// Connect once at startup
rippleAPI.connect()
  .then(() => console.log('Connected to Ripple Testnet'))
  .catch(err => console.error('Ripple connection failed:', err));
