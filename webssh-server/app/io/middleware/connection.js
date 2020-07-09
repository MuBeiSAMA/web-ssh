'use strict';

module.exports = () => {
  return async (ctx, next) => {
    console.log('disconnection!');
    await next();
  };
};
