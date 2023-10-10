const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

function getLocalStorageKey(userId) {
  return `companyInfo_${userId}`;
}

function setLocalStorageData(userId, data) {
  const storageValue = {
    data,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(
    getLocalStorageKey(userId),
    JSON.stringify(storageValue)
  );
}

function getLocalStorageData(userId) {
  const storageValue = localStorage.getItem(getLocalStorageKey(userId));

  if (!storageValue) {
    return null;
  }

  const { data, timestamp } = JSON.parse(storageValue);

  const now = new Date().getTime();
  if (now - timestamp > CACHE_DURATION) {
    localStorage.removeItem(getLocalStorageKey(userId));
    return null; // Cache is old and invalid, remove it and return null
  }

  return data; // Return cached data
}
