import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { DeviceInfo, DeviceService } from '../../services/backend/device.service';
import { LogService } from '../../services/logging/log.service';

@Component({
  selector: 'app-new-device',
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
    MatExpansionModule,
  ],
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss'],
})
export class DeviceDetailsComponent implements AfterContentInit {
  @ViewChild('canvasHumidity', { static: true })
  public canvasHumidity: ElementRef<HTMLCanvasElement> | undefined;

  @ViewChild('canvasPressure', { static: true })
  public canvasPressure: ElementRef<HTMLCanvasElement> | undefined;

  @ViewChild('canvasTemperature', { static: true })
  public canvasTemperature: ElementRef<HTMLCanvasElement> | undefined;

  @ViewChild('canvasGasResistance', { static: true })
  public canvasGasResistance: ElementRef<HTMLCanvasElement> | undefined;

  protected deviceId: string | null;

  protected deviceInfo: DeviceInfo | null = null;

  private deviceData:
    | {
        hour: number;
        humidity: number;
        pressure: number;
        temperature: number;
        gasResistance: number;
      }[]
    | null = null;

  constructor(
    private route: ActivatedRoute,
    private log: LogService,
    private device: DeviceService,
  ) {
    this.deviceId = this.route.snapshot.paramMap.get('id');
  }

  public async ngAfterContentInit(): Promise<void> {
    await this.getDeviceInfo();
    await this.getDeviceData();

    this.createHumidityChart();
    this.createPressureChart();
    this.createTemperatureChart();
    this.createGasResistanceChart();
  }

  private createHumidityChart(): void {
    if (!this.canvasHumidity || !this.deviceData) {
      return;
    }

    new Chart(this.canvasHumidity.nativeElement, {
      type: 'line',
      data: {
        labels: this.deviceData.map((point) => point.hour),
        datasets: [
          {
            label: 'Humidity',
            data: this.deviceData.map((point) => point.humidity),
            borderColor: '#B388FF',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  private createPressureChart(): void {
    if (!this.canvasPressure || !this.deviceData) {
      return;
    }

    new Chart(this.canvasPressure.nativeElement, {
      type: 'line',
      data: {
        labels: this.deviceData.map((point) => point.hour),
        datasets: [
          {
            label: 'Pressure',
            data: this.deviceData.map((point) => point.pressure),
            borderColor: '#B388FF',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  private createTemperatureChart(): void {
    if (!this.canvasTemperature || !this.deviceData) {
      return;
    }

    new Chart(this.canvasTemperature.nativeElement, {
      type: 'line',
      data: {
        labels: this.deviceData.map((point) => point.hour),
        datasets: [
          {
            label: 'Temperature',
            data: this.deviceData.map((point) => point.temperature),
            borderColor: '#B388FF',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  private createGasResistanceChart(): void {
    if (!this.canvasGasResistance || !this.deviceData) {
      return;
    }

    new Chart(this.canvasGasResistance.nativeElement, {
      type: 'line',
      data: {
        labels: this.deviceData.map((point) => point.hour),
        datasets: [
          {
            label: 'Gas Resistance',
            data: this.deviceData.map((point) => point.gasResistance),
            borderColor: '#B388FF',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  private async getDeviceInfo(): Promise<void> {
    if (!this.deviceId) {
      return;
    }

    try {
      this.deviceInfo = await this.device.getDevice(this.deviceId);
    } catch (error) {
      this.log.error(error);
    }
  }

  private async getDeviceData(): Promise<void> {
    if (!this.deviceId) {
      return;
    }

    try {
      this.deviceData = await this.device.getDeviceData(this.deviceId);
    } catch (error) {
      this.log.error(error);
    }
  }
}
