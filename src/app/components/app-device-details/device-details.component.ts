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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { DeviceInfo, DeviceService } from '../../services/backend/device.service';
import { LogService } from '../../services/logging/log.service';
import { WindowService } from '../../services/window/window.service';

/**
 * The device details component.
 */
@Component({
  selector: 'app-device-details',
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
  /**
   * A reference to the canvas element for the humidity chart.
   */
  @ViewChild('canvasHumidity', { static: true })
  public canvasHumidity: ElementRef<HTMLCanvasElement> | undefined;

  /**
   * A reference to the canvas element for the pressure chart.
   */
  @ViewChild('canvasPressure', { static: true })
  public canvasPressure: ElementRef<HTMLCanvasElement> | undefined;

  /**
   * A reference to the canvas element for the temperature chart.
   */
  @ViewChild('canvasTemperature', { static: true })
  public canvasTemperature: ElementRef<HTMLCanvasElement> | undefined;

  /**
   * A reference to the canvas element for the gas resistance chart.
   */
  @ViewChild('canvasGasResistance', { static: true })
  public canvasGasResistance: ElementRef<HTMLCanvasElement> | undefined;

  /**
   * A reference to the dialog template for authorizing a device.
   */
  @ViewChild('dialogAuthorize', { static: true })
  public dialogAuthorize: TemplateRef<unknown> | undefined;

  /**
   * A reference to the dialog template for deleting a device.
   */
  @ViewChild('dialogDelete', { static: true })
  public dialogDelete: TemplateRef<unknown> | undefined;

  /**
   * The id of the device.
   */
  protected deviceId: string | null;

  /**
   * The device info.
   */
  protected deviceInfo: DeviceInfo | null = null;

  /**
   * The current device activation code.
   */
  protected deviceCode: string | undefined = undefined;

  /**
   * The current device data.
   */
  private deviceData:
    | {
        hour: number;
        humidity: number;
        pressure: number;
        temperature: number;
        gasResistance: number;
      }[]
    | null = null;

  /**
   * The currently entered window url.
   */
  protected windowUrl: string | undefined;

  /**
   * Constructor.
   *
   * @param log The log service.
   * @param deviceService The device service.
   * @param windowService The window service.
   * @param dialog The material dialog.
   * @param route The currently active route.
   * @param router The router.
   */
  constructor(
    private log: LogService,
    private deviceService: DeviceService,
    private windowService: WindowService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.deviceId = this.route.snapshot.paramMap.get('id');
  }

  /**
   * Angular's lifecycle hook for after content initialization.
   */
  public async ngAfterContentInit(): Promise<void> {
    await this.getDeviceInfo();
    await this.getDeviceData();

    this.renderHumidityChart();
    this.createPressureChart();
    this.createTemperatureChart();
    this.createGasResistanceChart();
  }

  /**
   * Generates a new device activation code.
   */
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

  /**
   * Opens the device deletion dialog.
   */
  public attemptDeleteDevice(): void {
    if (!this.dialogDelete) {
      return;
    }

    this.dialog.open(this.dialogDelete, {
      width: '450px',
    });
  }

  /**
   * Deletes this device.
   */
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

  public async openWindow(): Promise<void> {
    if (!this.windowUrl) {
      return;
    }

    try {
      await this.windowService.open(this.windowUrl);
    } catch (error) {
      this.snackbar.open('Window could not be opened!', 'Ok', {
        duration: 5000,
      });
    }
  }

  /**
   * Renders the humidity chart.
   */
  private renderHumidityChart(): void {
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

  /**
   * Renders the pressure chart.
   */
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

  /**
   * Renders the temperature chart.
   */
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

  /**
   * Renders the gas resistance chart.
   */
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

  /**
   * Retrieves the device info.
   */
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

  /**
   * Retrieves the device data.
   */
  private async getDeviceData(): Promise<void> {
    if (!this.deviceId) {
      return;
    }

    try {
      const since = new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000);
      this.deviceData = await this.deviceService.getDeviceData(this.deviceId, since);
    } catch (error) {
      this.log.error(error);
    }
  }

  /**
   * Renders a chart.
   *
   * @param title The title of the chart.
   * @param canvas The canvas element to render the chart on.
   * @param labels The labels for the chart.
   * @param data The data for the chart.
   */
  private createChart(title: string, canvas: HTMLCanvasElement, labels: unknown[], data: unknown[]) {
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            borderColor: '#B39DDB',
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
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
                modifierKey: 'ctrl',
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
            },
          },
        },
      },
    });
  }
}
