/**
 * The storage interface.
 * Represents a key-value store.
 */
export interface IStore {
  /**
   * Adds a new key-value pair to the store.
   *
   * @param key The key.
   * @param value The value.
   */
  put(key: string, value: string): void;

  /**
   * Searches the store for the given key and returns the corresponding value,
   * if it exists.
   *
   * @param key The key.
   *
   * @returns The value corresponding to the given key, if it exists.
   */
  get(key: string): string | null;

  /**
   * Removes the key-value pair from the store.
   *
   * @param key The key.
   */
  delete(key: string): void;
}

/**
 * The local storage implementation of the store interface.
 */
export class LocalStore {
  /**
   * Adds a new key-value pair to the store.
   *
   * @param key The key.
   * @param value The value.
   */
  public put(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Searches the store for the given key and returns the corresponding value,
   * if it exists.
   *
   * @param key The key.
   *
   * @returns The value corresponding to the given key, if it exists.
   */
  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Removes the key-value pair from the store.
   *
   * @param key The key.
   */
  public delete(key: string): void {
    localStorage.removeItem(key);
  }
}
