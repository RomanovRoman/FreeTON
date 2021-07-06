
export
enum networks {
  LOCAL = 'LOCAL',
  /*
  DEVNET = 'DEVNET',
  MAINNET = 'MAINNET',
  */
}


export
const configs = {
  [networks.LOCAL]: {
    url: 'http://0.0.0.0',
    multisig: {
      // https://github.com/tonlabs/tonos-se/tree/master/contracts/safe_multisig
      address: '0:d5f5cfc4b52d2eb1bd9d3a8e51707872c7ce0c174facddd0e06ae5ffd17d2fcd',
      keys: { // keys.json
        public: '99c84f920c299b5d80e4fcce2d2054b05466ec9df19532a688c10eb6dd8d6b33',
        secret: '73b60dc6a5b1d30a56a81ea85e0e453f6957dbfbeefb57325ca9f7be96d3fe1a',
      },
    },
  },
  /*
  [networks.DEVNET]: {
    url: 'https://net.ton.dev',
    multisig: {
      address: '',
      keys: {
        public: '',
        secret: '',
      },
    },
  },
  [networks.MAINNET]: {
    url: 'https://main.ton.dev',
    multisig: {
      address: '',
      keys: {
        public: '',
        secret: '',
      },
    },
  },
  */
};

// export default configs;
