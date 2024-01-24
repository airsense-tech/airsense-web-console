import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DeviceInfo, DeviceService } from '../../services/backend/device.service';
import { LogService } from '../../services/logging/log.service';
import { DeviceCardComponent } from '../app-device-card/device-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    DeviceCardComponent,
  ],
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss'],
})
export class DeviceManagementComponent implements OnInit {
  protected devices: DeviceInfo[] = [];

  constructor(
    private log: LogService,
    private deviceService: DeviceService,
    private snackbar: MatSnackBar,
  ) {}

  public async ngOnInit(): Promise<void> {
    await this.loadDevices();
  }

  private async loadDevices(): Promise<void> {
    try {
      this.devices = await this.deviceService.getDevices();
    } catch (error) {
      this.log.error(error);
      this.snackbar.open('Something went wrong! Try again later :(', 'Ok', {
        duration: 5000,
      });
    }
  }
}
