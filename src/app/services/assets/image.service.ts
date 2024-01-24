import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private static readonly imagePath = '/assets/images';

  constructor(private http: HttpClient) {}

  public async fetchImage(name: string): Promise<HttpResponse<Blob>> {
    const img = `${ImageService.imagePath}/${name}.jpg`;

    return new Promise((resolve, reject) => {
      this.http.get(img, { observe: 'response', responseType: 'blob' }).subscribe({
        next: (image) => {
          resolve(image);
        },
        error: () => {
          this.fetchPlaceholder()
            .then((placeholder) => {
              resolve(placeholder);
            })
            .catch((err) => {
              reject(err);
            });
        },
      });
    });
  }

  private async fetchPlaceholder(): Promise<HttpResponse<Blob>> {
    return new Promise((resolve, reject) => {
      this.http
        .get('https://placehold.co/1024x1024?text=placeholder', { observe: 'response', responseType: 'blob' })
        .subscribe({
          next: (placeholder) => {
            resolve(placeholder);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
}
