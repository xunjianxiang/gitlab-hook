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

  router.post('/api/ci/get_group_list', controller.group.getGroupList);
  router.post('/api/ci/get_gitlab_group_list', controller.group.getGitlabGroupList);
  router.post('/api/ci/add_group', controller.group.addGroup);
  router.post('/api/ci/add_group_user', controller.group.addGroupUser);
  router.post('/api/ci/delete_group_user', controller.group.deleteGroupUser);
  router.post('/api/ci/get_group_setting', controller.group.getGroupSetting);
  router.post('/api/ci/update_group_setting', controller.group.updateGroupSetting);

};
