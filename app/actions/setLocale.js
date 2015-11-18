module.exports = function (actionContext, payload, done) {
  setTimeout(function () {
    actionContext.dispatch('SET_LOCALE', payload);
    done();
  }, 10);
}