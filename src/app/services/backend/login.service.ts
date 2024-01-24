import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StoreService } from '../storage/store.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) {}

  public async login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      return this.http
        .post(`${environment.api}/api/v1/users/login`, { email: email, password: password }, { responseType: 'text' })
        .subscribe({
          next: (token) => {
            this.store.put('token', token as string);
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }
}
