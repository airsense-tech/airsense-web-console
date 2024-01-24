import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
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
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
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

  @ViewChild('dialogAuthorize', { static: true })
  public dialogAuthorize: TemplateRef<unknown> | undefined;

  @ViewChild('dialogDelete', { static: true })
  public dialogDelete: TemplateRef<unknown> | undefined;

  protected deviceId: string | null;

  protected deviceInfo: DeviceInfo | null = null;

  protected deviceCode: string | undefined = undefined;

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
    private log: LogService,
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
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

  public async authorizeDevice(): Promise<void> {
    if (!this.deviceId || !this.dialogAuthorize) {
      return;
    }

    try {
      const result = await this.deviceService.createDeviceCode(this.deviceId);
      this.deviceCode = result.code;

      this.dialog.open(this.dialogAuthorize, {
        width: '450px',
      });
    } catch (error) {
      this.log.error(error);
    }
  }

  public attemptDeleteDevice(): void {
    if (!this.dialogDelete) {
      return;
    }

    this.dialog.open(this.dialogDelete, {
      width: '450px',
    });
  }

  public async deleteDevice(): Promise<void> {
    if (!this.deviceId) {
      return;
    }

    try {
      await this.deviceService.deleteDevice(this.deviceId);
      await this.router.navigate(['/devices']);
    } catch (error) {
      this.log.error(error);
    }
  }

  private createHumidityChart(): void {
    if (!this.canvasHumidity || !this.deviceData) {
      return;
    }

    this.createChart(
      'Humidity',
      this.canvasHumidity.nativeElement,
      this.deviceData.map((point) => point.hour),
      this.deviceData.map((point) => point.humidity),
    );
  }

  private createPressureChart(): void {
    if (!this.canvasPressure || !this.deviceData) {
      return;
    }

    this.createChart(
      'Pressure',
      this.canvasPressure.nativeElement,
      this.deviceData.map((point) => point.hour),
      this.deviceData.map((point) => point.pressure),
    );
  }

  private createTemperatureChart(): void {
    if (!this.canvasTemperature || !this.deviceData) {
      return;
    }

    this.createChart(
      'Temperature',
      this.canvasTemperature.nativeElement,
      this.deviceData.map((point) => point.hour),
      this.deviceData.map((point) => point.temperature),
    );
  }

  private createGasResistanceChart(): void {
    if (!this.canvasGasResistance || !this.deviceData) {
      return;
    }

    this.createChart(
      'Gas Resistance',
      this.canvasGasResistance.nativeElement,
      this.deviceData.map((point) => point.hour),
      this.deviceData.map((point) => point.gasResistance),
    );
  }

  private async getDeviceInfo(): Promise<void> {
    if (!this.deviceId) {
      return;
    }

    try {
      this.deviceInfo = await this.deviceService.getDevice(this.deviceId);
    } catch (error) {
      this.log.error(error);
    }
  }

  private async getDeviceData(): Promise<void> {
    if (!this.deviceId) {
      return;
    }

    try {
      this.deviceData = await this.deviceService.getDeviceData(this.deviceId);
    } catch (error) {
      this.log.error(error);
    }
  }

  private createChart(title: string, canvas: HTMLCanvasElement, labels: unknown[], data: unknown[]) {
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            borderColor: '#E0F7FA',
            fill: true,
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
        plugins: {
          legend: {
            position: 'bottom',
            align: 'end',
          },
        },
      },
    });
  }
}
