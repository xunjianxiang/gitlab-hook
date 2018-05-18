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
  router.post('/api/ci/add_group', controller.group.addGroup);
  router.post('/api/ci/get_group_user_list', controller.group.getGroupUserList);
  router.post('/api/ci/add_group_user', controller.group.addGroupUser);
  router.post('/api/ci/delete_group_user', controller.group.deleteGroupUser);
  router.post('/api/ci/get_group_setting', controller.group.getGroupSetting);
  router.post('/api/ci/update_group_setting', controller.group.updateGroupSetting);

  router.post('/api/ci/get_gitlab_group_list', controller.gitlab.getGitlabGroupList);
  router.post('/api/ci/get_gitlab_group_member_list', controller.gitlab.getGitlabGroupMemberList);
  router.post('/api/ci/get_gitlab_project_list', controller.gitlab.getGitlabProjectList);
  router.post('/api/ci/get_gitlab_project_member_list', controller.gitlab.getGitlabProjectMemberList);

};
