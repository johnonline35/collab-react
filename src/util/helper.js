export function FetchWrapper(promise1, promise2, promise3) {
  return Promise.all([promise1, promise2, promise3]).then((values) => {
    return values;
  });
}
