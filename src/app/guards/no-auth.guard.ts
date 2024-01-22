import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../services/storage/store.service';

/**
 * The no auth guard.
 * This guard is used to protect routes cannot be accessed when the user is authenticated.
 */
@Injectable({ providedIn: 'root' })
export class NoAuthGuard {
  /**
   * Constructor.
   *
   * @param store The store service.
   * @param router The router.
   */
  constructor(
    private store: StoreService,
    private router: Router,
  ) {}

  /**
   * Whether the user can activate the route.
   *
   * @returns True, if the user can activate the route, false otherwise.
   */
  public async canActivate(): Promise<boolean> {
    const token = this.store.get('token');

    if (token) {
      return this.router.navigate(['/devices']);
    }

    return true;
  }
}
