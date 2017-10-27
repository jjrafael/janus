var Path = require('path')
var app_root = 'src' // the app root folder: src, src_users, etc

module.exports = {
  phxStore: getSrcPath('store.js'),
  phxUtils: getSrcPath('utils.js'),
  phxActions: getSrcPath('actions'),
  phxComponents: getSrcPath('components'),
  phxConfigs: getSrcPath('configs'),
  phxConstants: getSrcPath('constants'),
  phxContainers: getSrcPath('containers'),
  phxServices: getSrcPath('services'),
  phxValidations: getSrcPath('validations.js'),
  phxSagas: getSrcPath('sagas'),
  phxNewComponents: getSrcPath('componentsNew'),
  phxV2Components: getSrcPath('componentsV2'),
  //Janus
  rootStore: getSrcPath('store.js'),
  rootUtils: getSrcPath('utils.js'),
  rootActions: getSrcPath('actions'),
  rootComponents: getSrcPath('components'),
  rootConstants: getSrcPath('constants'),
  rootServices: getSrcPath('services'),
  rootValidations: getSrcPath('validations.js'),
  rootSagas: getSrcPath('sagas'),
}

function getSrcPath(srcPath) {
  return Path.resolve(__dirname, app_root, srcPath)
}

// export default aliasList;
