'use strict';

const crypto = require('crypto');
const xml2js = require('xml2js');
const nodemailer = require('nodemailer');

module.exports = {

  async mongooseErrorCatch(error) {
    // 上报
    this.ctx.logger.error(error);
    return null;
  },

  apiParamsInject(api, ...params) {
    params.forEach(param => {
      api = api.replace(/{\d}/, param);
    });
    return api;
  },

  xml2js(data) {
    return new Promise((resolve, reject) => {
      new xml2js.Parser({ explicitArray: false }).parseString(data, function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }).catch(error => {
      console.error('error', error);
      return;
    });
  },

  dingtalk(options = {}) {
    const { id, level, data } = options;
    const token = 'YYLmfY6IRdjZMQ1';
    const sign = crypto.createHash('md5').update(`${id}${level}${data}${token}`).digest('hex');
    this.app.curl('http://osa.shuzilm.cn/alarm', {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: { id, level, data, sign },
    })
      .then(res => res.data)
      .catch(error => {
        this.logger.error(error);
      });
  },

  mail(options) {
    const { to, subject, text, html } = options;
    return nodemailer
      .createTransport({
        host: 'smtp.partner.outlook.cn',
        port: 587,
        auth: {
          user: 'it@shuzilm.cn',
          pass: 'Puyu7636',
        },
      })
      .sendMail({
        from: 'it@shuzilm.cn',
        to: to.join(', '),
        subject,
        text,
        html,
      })
      .catch(error => {
        this.logger.error(error);
      });

  },

};
