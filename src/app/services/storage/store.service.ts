import { Injectable } from '@angular/core';
import { IStore, LocalStore } from '../../storage/store';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly store: IStore;

  constructor() {
    this.store = new LocalStore();
  }

  public put(key: string, value: string): void {
    this.store.put(key, value);
  }

  public get(key: string): string | null {
    return this.store.get(key);
  }

  public delete(key: string): void {
    this.store.delete(key);
  }
}
