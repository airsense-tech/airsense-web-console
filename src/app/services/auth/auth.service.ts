import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../storage/store.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private store: StoreService,
    private router: Router,
  ) {}

  public isAuthenticated(): boolean {
    return !!this.store.get('token');
  }

  public async logout(): Promise<boolean> {
    this.store.delete('token');
    return await this.router.navigate(['/login']);
  }
}
