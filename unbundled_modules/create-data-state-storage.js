const cloneData = require("./clone-data.js");

const createDataStateStorage = (initialDataState = {}) => {
  let __dataState = cloneData(initialDataState);
  let __keySubscribers = {};
  let __subscriberActions = {};
  let __subscriberKeys = {};
  let __subscriberId = 0;

  const getSubscriberId = () => {
    __subscriberId++;
    return __subscriberId;
  };

  const getDataState = () => cloneData(__dataState);

  const setDataState = (dataState) => {
    __dataState = cloneData(dataState);
    return __dataState;
  };

  const get = (key) => cloneData(__dataState[key]);

  const set = (newData) => {
    __dataState = Object.assign({}, cloneData(__dataState), cloneData(newData));

    const entriesOfSubscriberKeys = Object.entries(__subscriberKeys);

    for (const [subscriberId, keys] of entriesOfSubscriberKeys) {
      const updatedKeyValues = {};

      for (const key of keys) {
        if (key in newData) {
          updatedKeyValues[key] = cloneData(newData[key]);
        }
      }

      if (Object.keys(updatedKeyValues).length > 0) {
        if (typeof __subscriberActions[subscriberId] === "function") {
          __subscriberActions[subscriberId](updatedKeyValues);
        }
      }
    }
  };

  const setSubscriber = (keys, subscriberId, action) => {
    for (const key of keys) {
      if (key in __keySubscribers) {
        __keySubscribers[key].push(subscriberId);
      } else {
        __keySubscribers[key] = [subscriberId];
      }

      if (!(subscriberId in __subscriberActions)) {
        __subscriberActions[subscriberId] = action;
      }

      if (subscriberId in __subscriberKeys) {
        __subscriberKeys[subscriberId].push(key);
      } else {
        __subscriberKeys[subscriberId] = [key];
      }
    }
  };

  const unsetSubscriber = (keys, subscriberId) => {
    delete __subscriberActions[subscriberId];
    delete __subscriberKeys[subscriberId];

    for (const key of keys) {
      __keySubscribers[key] = __keySubscribers[key].filter(
        (_subscriberId) => _subscriberId !== subscriberId
      );
    }
  };

  return {
    getSubscriberId,
    setDataState,
    getDataState,
    get,
    set,
    setSubscriber,
    unsetSubscriber,
  };
};

module.exports = createDataStateStorage;
