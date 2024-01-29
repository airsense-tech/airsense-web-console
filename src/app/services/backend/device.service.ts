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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id: string;

  /**
   * The user this device belongs to.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
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

/**
 * A device activation code model.
 */
export interface DeviceCodeInfo {
  /**
   * The id of the entry.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id: string;

  /**
   * The id of the user to which the device belongs to.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _userId: string;

  /**
   * The id of the device to be registered.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _deviceId: string;

  /**
   * The actual registration code.
   */
  code: string | undefined;

  /**
   * The time when this code was created.
   */
  createdOn: Date | undefined;
}

/**
 * The device service.
 * This service is responsible for device management.
 */
@Injectable({ providedIn: 'root' })
export class DeviceService {
  /**
   * Constructor.
   *
   * @param http The http client.
   * @param store The store service.
   */
  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) {}

  /**
   * Creates a new device.
   *
   * @param name The device name.
   *
   * @returns Information about the created device.
   */
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

  /**
   * Creates a device registration code.
   *
   * @param id The id of the device to activate.
   *
   * @returns The device activation code information.
   */
  public async createDeviceCode(id: string): Promise<DeviceCodeInfo> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);

      return this.http.post(`${environment.api}/api/v1/devices/${id}/code`, {}, { headers: headers }).subscribe({
        next: (device) => {
          resolve(device as DeviceCodeInfo);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  /**
   * Deletes a device.
   *
   * @param id The id of the device to delete.
   */
  public async deleteDevice(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);

      return this.http.delete(`${environment.api}/api/v1/devices/${id}`, { headers: headers }).subscribe({
        next: () => {
          resolve();
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  /**
   * Retrieves device information.
   *
   * @param id The id of the device to get.
   *
   * @returns Information about the device.
   */
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

  /**
   * Retrieves all devices.
   *
   * @returns Information about all devices.
   */
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

  /**
   * Retrieves the data measured by a specific device.
   *
   * @param id The id of the device to get the data from.
   *
   * @returns The data measured by the device.
   */
  public async getDeviceData(
    id: string,
    since: Date = new Date(Date.now() - 24 * 60 * 60 * 1000),
  ): Promise<{ humidity: number; pressure: number; temperature: number; gasResistance: number; createdOn: Date }[]> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);
      const sinceUnix = Math.floor(since.getTime());

      return this.http
        .get(`${environment.api}/api/v1/devices/${id}/data?since=${sinceUnix}`, { headers: headers })
        .subscribe({
          next: (devices) => {
            resolve(
              devices as {
                humidity: number;
                pressure: number;
                temperature: number;
                gasResistance: number;
                createdOn: Date;
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
