let angularRequestHandler;

module.exports = async function handleAngularRequest(request, response) {
  angularRequestHandler ??= import('./server/server.mjs').then(
    ({ reqHandler }) => reqHandler
  );

  return (await angularRequestHandler)(request, response);
};
