import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StoreService } from '../storage/store.service';

/**
 * The trigger action data model.
 */
export interface TriggerInfo {
  /**
   * The trigger action id.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id: string;

  /**
   * The user id.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _userId: string;

  /**
   * The device id.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _deviceId: string;

  /**
   * The trigger name.
   */
  name: string;

  /**
   * The trigger id.
   */
  postUrl: string;

  /**
   * Depending on the operator, the trigger will be fired when the value is greater than,
   * greater than or equal to, less than, or less than or equal to the threshold.
   */
  threshold: number;

  /**
   * The parameter to compare.
   */
  parameter: 'humidity' | 'pressure' | 'temperature' | 'gasResistance';

  /**
   * The operator used to compare the threshold.
   */
  operator: 'gt' | 'gte' | 'lt' | 'lte';

  /**
   * The date the trigger was created on.
   */
  createdOn: Date;
}

@Injectable({ providedIn: 'root' })
export class TriggerService {
  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) {}

  public async createTrigger(
    deviceId: string,
    name: string,
    postUrl: string,
    threshold: number,
    parameter: string,
    operator: string,
  ): Promise<TriggerInfo> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);

      return this.http
        .post(
          `${environment.api}/api/v1/devices/${deviceId}/trigger`,
          { name: name, postUrl: postUrl, threshold: threshold, parameter: parameter, operator: operator },
          { headers: headers },
        )
        .subscribe({
          next: (trigger) => {
            resolve(trigger as TriggerInfo);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  public async deleteTrigger(triggerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);

      return this.http.delete(`${environment.api}/api/v1/triggers/${triggerId}`, { headers: headers }).subscribe({
        next: () => {
          resolve();
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async getTriggers(deviceId: string): Promise<TriggerInfo[]> {
    return new Promise((resolve, reject) => {
      const token = this.store.get('token');

      if (!token) {
        reject('authentication token not found');
      }

      const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);

      return this.http.get(`${environment.api}/api/v1/devices/${deviceId}/triggers`, { headers: headers }).subscribe({
        next: (trigger) => {
          resolve(trigger as TriggerInfo[]);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
