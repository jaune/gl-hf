module.exports = function (actionContext, payload, done) {
  setTimeout(function () {
    actionContext.dispatch('SET_TITLE', payload);
    done();
  }, 10);
}