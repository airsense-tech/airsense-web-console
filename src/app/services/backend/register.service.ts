import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StoreService } from '../storage/store.service';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) {}

  public async register(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      return this.http
        .post(
          `${environment.api}/api/v1/users/register`,
          { firstName: firstName, lastName: lastName, email: email, password: password },
          { responseType: 'text' },
        )
        .subscribe({
          next: () => {
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }
}
