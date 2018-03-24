export function values<T>(obj: { [key: string]: T }): T[] {
  return Object.keys(obj).map(key => obj[key])
}

export interface KeyedObj<T> {
  [key: string]: T
}
export function addKey<T>(obj: KeyedObj<T>) {
  Object.keys(obj).forEach((key) => { obj[key]['key'] = key })
  return obj
}

// TODO: can this be combined with above
export interface IdedObj<T> {
  [id: string]: T
}
export function addId<T>(obj: IdedObj<T>) {
  Object.keys(obj).forEach((key) => { obj[key]['id'] = key })
  return obj
}
