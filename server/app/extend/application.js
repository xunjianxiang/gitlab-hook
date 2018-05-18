'use strict';

module.exports = {
  async ldap(username, password) {
    const { data } = await this.curl('http://osa.du.com/api/ldap_login', {
      method: 'POST',
      contentType: 'form',
      dataType: 'json',
      data: {
        username,
        password,
        auth: 'ci',
      },
    }).catch(error => {
      this.logger.error(error);
      // 上报
      return {
        status: error.status,
        data: {
          status: error.status,
        },
      };
    });

    return data.status;
  },

  async invokeGitlabApi(path) {
    const { data } = await this.curl('http://osa.du.com/api/git_api/v1', {
      method: 'POST',
      contentType: 'form',
      dataType: 'json',
      data: {
        path,
      },
    }).catch(error => {
      // 上报
      return {
        status: error.status,
        data: {
          message: 'gitlab api 访问失败',
        },
      };
    });
    return data;
  },

};
