'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name;

  // add your config here
  config.middleware = [
    'interceptor',
  ];

  config.interceptor = {
    ignore: /\/login|\/session/,
  };

  config.session = {
    key: 'gitlab-webhook',
    maxAge: 20 * 60 * 1000,
    httpOnly: true,
    signed: true,
    encrypt: true,
    renew: true,
  };

  config.security = {
    csrf: false,
  };

  config.mongoose = {
    clients: {
      ci: {
        url: 'mongodb://127.0.0.1/ci',
        options: {},
      },
      yapi: {
        url: 'mongodb://127.0.0.1/yapi',
        options: {},
      },
    },
  };

  return config;
};
