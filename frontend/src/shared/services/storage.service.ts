

class StorageService {
  static set(key: string, value: string | number) {
    localStorage.setItem(key, value as string)
  }

  static get(key: string) {
    return localStorage.getItem(key)
  }

  static delete(key: string) {
    localStorage.removeItem(key)
  }
}

export default StorageService