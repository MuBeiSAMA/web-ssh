'use strict';

const Controller = require('egg').Controller;
const SSHClient = require('ssh2').Client;
const utf8 = require('utf8');

class DefaultController extends Controller {
  async index() {
    const { ctx } = this;
    const ssh = new SSHClient();
    const { msgId, ip, username, password } = ctx.args[0];

    // await ctx.socket.emit(`Hi! I've got your message: ${msgId}`);

    ssh.on('ready', () => {
      ssh.shell((err, stream) => {
        if (err) {
          return ctx.socket.emit('\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
        }
        ctx.socket.on(msgId, data => {
          stream.write(data);
        });
        stream.on('data', d => {
          ctx.socket.emit(msgId, utf8.decode(d.toString('binary')));
        }).on('close', () => {
          console.log('close');
          ssh.end();
        });
      });
    }).on('close', () => {
      ctx.socket.emit(msgId, '\r\n*** SSH CONNECTION CLOSED ***\r\n');
    }).on('error', err => {
      console.log(err);
      ctx.socket.emit(msgId, '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
    })
      .connect({
        host: ip,
        port: 22,
        username,
        password,
      });
  }

}

module.exports = DefaultController;
