const loadAngularRequestHandler = (
  importServer = () => import('./server/server.mjs')
) => importServer().then(({ reqHandler }) => reqHandler);

function createAngularRequestHandler(loadHandler = loadAngularRequestHandler) {
  let angularRequestHandler;

  return async function handleAngularRequest(request, response) {
    angularRequestHandler ??= loadHandler();

    return (await angularRequestHandler)(request, response);
  };
}

module.exports = createAngularRequestHandler();
module.exports.createAngularRequestHandler = createAngularRequestHandler;
module.exports.loadAngularRequestHandler = loadAngularRequestHandler;
