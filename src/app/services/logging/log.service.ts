import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LogService {
  public trace(...messages: unknown[]): void {
    console.trace('[trace]', ...messages);
  }

  public debug(...messages: unknown[]): void {
    console.debug('[debug]', ...messages);
  }

  public info(...messages: unknown[]): void {
    console.info('[info ]', ...messages);
  }

  public warn(...messages: unknown[]): void {
    console.warn('[warn ]', ...messages);
  }

  public error(...messages: unknown[]): void {
    console.error('[error]', ...messages);
  }
}
