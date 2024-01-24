import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { DeviceService } from '../../services/backend/device.service';
import { LogService } from '../../services/logging/log.service';

@Component({
  selector: 'app-new-device',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
  ],
  templateUrl: './new-device.component.html',
  styleUrls: ['./new-device.component.scss'],
})
export class NewDeviceComponent {
  protected deviceName: string | undefined;

  protected isCreateInProgress: boolean = false;

  constructor(
    private log: LogService,
    private deviceService: DeviceService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  protected async createDevice(): Promise<void> {
    if (!this.deviceName) {
      return;
    }

    this.isCreateInProgress = true;

    try {
      await this.deviceService.createDevice(this.deviceName);
      await this.router.navigate(['/devices']);
    } catch (error) {
      this.log.error(`failed to create device: ${error}`);
      this.snackBar.open('Something went wrong! Try again later :(', 'Dismiss', { duration: 5000 });
    } finally {
      this.isCreateInProgress = false;
    }
  }
}
