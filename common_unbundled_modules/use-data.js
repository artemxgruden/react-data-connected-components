const { useContext, useState, useEffect, useMemo } = require("react");

const { dataStateStorageContext } = require("./contexts.js");

const getData = require("./get-data.js");

const useData = (keys = []) => {
  const dataStateStorage = useContext(dataStateStorageContext);

  const subscriberId = useMemo(() => dataStateStorage.getSubscriberId(), [
    ...keys,
  ]);

  const initialData = useMemo(() => getData(dataStateStorage, keys), [...keys]);

  const [data, setData] = useState(initialData);

  const updateState = (updatedData) => {
    setData((oldData) => ({ ...oldData, ...updatedData }));
  };

  useEffect(() => {
    dataStateStorage.setSubscriber(keys, subscriberId, updateState);
    return () => dataStateStorage.unsetSubscriber(keys, subscriberId);
  }, [...keys]);

  return { ...data };
};

module.exports = useData;
