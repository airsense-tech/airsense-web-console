import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StoreService } from '../storage/store.service';

@Injectable({ providedIn: 'root' })
export class HumidityService {
  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) {}

  public async pull(): Promise<{ hour: number; humidity: number }[]> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');
      if (!token) {
        reject('Could not find token in store.');
        return;
      }

      const headers = new HttpHeaders().append('authorization', `Bearer ${token}`);

      this.http
        .get(`${environment.api}/api/v1/sensors/avg?filter=humidity`, {
          headers: headers,
        })
        .subscribe({
          next: (data) => {
            resolve(data as { hour: number; humidity: number }[]);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }
}
