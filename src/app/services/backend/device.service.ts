import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StoreService } from '../storage/store.service';

/**
 * Represents a single device, which is recording data points.
 */
export interface DeviceInfo {
  /**
   * The device id.
   */
  _id: string;

  /**
   * The user this device belongs to.
   */
  _userId: string;

  /**
   * The device name.
   */
  name: string | undefined;

  /**
   * The time when this device was created.
   */
  createdOn: Date | undefined;
}

@Injectable({ providedIn: 'root' })
export class DeviceService {
  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) {}

  public async createDevice(name: string): Promise<DeviceInfo> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);

      return this.http.post(`${environment.api}/api/v1/devices`, { name: name }, { headers: headers }).subscribe({
        next: (device) => {
          resolve(device as DeviceInfo);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async getDevice(id: string): Promise<DeviceInfo> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);

      return this.http.get(`${environment.api}/api/v1/devices/${id}`, { headers: headers }).subscribe({
        next: (devices) => {
          resolve(devices as DeviceInfo);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async getDevices(): Promise<DeviceInfo[]> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);

      return this.http.get(`${environment.api}/api/v1/devices`, { headers: headers }).subscribe({
        next: (devices) => {
          resolve(devices as DeviceInfo[]);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async getDeviceData(
    id: string,
  ): Promise<{ hour: number; humidity: number; pressure: number; temperature: number; gasResistance: number }[]> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);

      return this.http.get(`${environment.api}/api/v1/devices/${id}/data`, { headers: headers }).subscribe({
        next: (devices) => {
          resolve(
            devices as {
              hour: number;
              humidity: number;
              pressure: number;
              temperature: number;
              gasResistance: number;
            }[],
          );
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
