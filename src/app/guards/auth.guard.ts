import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../services/storage/store.service';

/**
 * The auth guard.
 * This guard is used to protect routes that require authentication.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard {
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

    if (!token) {
      return this.router.navigate(['/login']);
    }

    return true;
  }
}
