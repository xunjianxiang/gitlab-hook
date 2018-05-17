'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('controller hook', () => {

  it('login normal success', () => {
    return app.httpRequest()
      .post('/api/ci/login')
      .type('json')
      .send({
        name: 'admin',
        password: 'admin',
      })
      .expect(200)
      .expect(res => {
        assert(res.body.code === 0, '本地登录成功返回状态错误');
      });
  });

  it('login normal failure', () => {
    return app.httpRequest()
      .post('/api/ci/login')
      .type('json')
      .send({
        name: 'xunjx',
        password: 'asdf1234',
      })
      .expect(200)
      .expect(res => {
        assert(res.body.code === 1, '本地登录失败返回状态错误');
      });
  });

  it('login ldap success', () => {
    return app.httpRequest()
      .post('/api/ci/login')
      .type('json')
      .send({
        name: 'xunjx',
        password: 'Du@szlm123',
        isldap: true,
      })
      .expect(200)
      .expect(res => {
        assert(res.body.code === 0, 'ldap 登录成功返回状态错误');
      });
  });

  it('login ldap failure', () => {
    return app.httpRequest()
      .post('/api/ci/login')
      .type('json')
      .send({
        name: 'xunjx',
        password: 'asdf1234',
        isldap: true,
      })
      .expect(200)
      .expect(res => {
        assert(res.body.code === 2001, 'ldap 登录失败返回状态错误');
      });
  });

  it('session success', () => {
    app.mockSession({
      user: {
        name: 'zhangsan',
      },
    });
    return app.httpRequest()
      .post('/api/ci/session')
      .expect(200)
      .expect(res => {
        assert(res.body.code === 0, 'session 没有返回预定信息');
      });
  });

  it('session fail', () => {
    return app.httpRequest()
      .post('/api/ci/session')
      .expect(200)
      .expect(res => {
        assert(res.body.code === 0, 'session 校验失败');
      });
  });

  it('logout success', () => {
    return app.httpRequest()
      .post('/api/ci/logout')
      .expect(200)
      .expect(res => {
        assert(res.body.code === 0, '登出失败');
      });
  });

});
