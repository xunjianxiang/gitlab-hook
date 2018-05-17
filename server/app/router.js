'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/api/ci/hook', controller.hook.index);

  router.post('/api/ci/login', controller.auth.login);
  router.post('/api/ci/session', controller.auth.session);
  router.post('/api/ci/logout', controller.auth.logout);

};
