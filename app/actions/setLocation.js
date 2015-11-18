module.exports = function (context, payload, done) {
    var routeStore = context.getStore('RouteStore');
    
    context.dispatch('NAVIGATE_START', payload);

    var action = routeStore.getCurrentRouteAction();

    if (!action) {
      console.log('>>> !action');
      context.dispatch('NAVIGATE_SUCCESS', {});
      done();
      return;
    }

    console.log('>>> execute action');
    context.executeAction(action, payload, function (error) {
      if (error) {
        context.dispatch('NAVIGATE_FAILURE', {});
        done(error);
      } else {
        context.dispatch('NAVIGATE_SUCCESS', {});
        done();
      }
    });
}