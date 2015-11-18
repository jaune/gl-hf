module.exports = function (actionContext, payload, done) {
  actionContext.dispatch('LOAD_AUTHORIZATION_START', payload);

  var authorize_uuid = payload.params.authorize_uuid || null;

  if (!authorize_uuid) {
    actionContext.dispatch('LOAD_AUTHORIZATION_FAILURE', {});
    done();
    return;
  }

  actionContext.resource.get(['/authorization', authorize_uuid], function (error, resource) {
    if (error) {
      actionContext.dispatch('LOAD_AUTHORIZATION_FAILURE', {});
      done();
    } else {
      actionContext.dispatch('LOAD_AUTHORIZATION_SUCCESS', resource);
      done();
    }
  });

}