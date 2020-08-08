const getData = (dataStateStorage, keys = []) => {
  const dataState = dataStateStorage.getDataState();

  return keys.reduce((a, v) => {
    a[v] = dataState[v];
    return a;
  }, {});
};

module.exports = getData;
