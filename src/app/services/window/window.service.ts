import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WindowService {
  constructor(private http: HttpClient) {}

  public async open(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(`${url}`, {}).subscribe({
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
