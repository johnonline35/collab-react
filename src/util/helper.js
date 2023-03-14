export function FetchWrapper(promise1, promise2) {
  return Promise.all([promise1, promise2]).then((values) => {
    return values;
  });
}
