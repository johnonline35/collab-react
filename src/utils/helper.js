export function FetchWrapper(promises) {
  return Promise.all(promises).then((values) => {
    return values;
  });
}
