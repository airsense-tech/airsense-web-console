import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { DataService } from '../../services/backend/data.service';
import { LogService } from '../../services/logging/log.service';

@Component({
  selector: 'app-data-overview',
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
  templateUrl: './data-overview.component.html',
})
export class DataOverviewComponent implements AfterContentInit {
  @Input()
  public device: string = '';

  @ViewChild('canvasHumidity', { static: true })
  public canvasHumidity: ElementRef<HTMLCanvasElement> | undefined;

  @ViewChild('canvasPressure', { static: true })
  public canvasPressure: ElementRef<HTMLCanvasElement> | undefined;

  @ViewChild('canvasTemperature', { static: true })
  public canvasTemperature: ElementRef<HTMLCanvasElement> | undefined;

  @ViewChild('canvasGasResistance', { static: true })
  public canvasGasResistance: ElementRef<HTMLCanvasElement> | undefined;

  constructor(
    private log: LogService,
    private humidityService: DataService,
  ) {}

  public async ngAfterContentInit(): Promise<void> {
    if (!this.canvasHumidity) {
      return;
    }

    try {
      const data = await this.humidityService.get();

      this.renderHumidityChart(data);
      this.renderPressureChart(data);
      this.renderTemperatureChart(data);
      this.renderGasResistanceChart(data);
    } catch (error) {
      this.log.error(error);
    }
  }

  private renderHumidityChart(
    data: { hour: number; humidity: number; pressure: number; temperature: number; gasResistance: number }[],
  ): void {
    if (!this.canvasHumidity) {
      return;
    }

    this.createChart(
      'Humidity (Avg)',
      this.canvasHumidity.nativeElement,
      data.map((d) => d.hour),
      data.map((d) => d.humidity),
    );
  }

  private renderPressureChart(
    data: { hour: number; humidity: number; pressure: number; temperature: number; gasResistance: number }[],
  ): void {
    if (!this.canvasPressure) {
      return;
    }

    this.createChart(
      'Pressure (Avg)',
      this.canvasPressure.nativeElement,
      data.map((d) => d.hour),
      data.map((d) => d.pressure),
    );
  }

  private renderTemperatureChart(
    data: { hour: number; humidity: number; pressure: number; temperature: number; gasResistance: number }[],
  ): void {
    if (!this.canvasTemperature) {
      return;
    }

    this.createChart(
      'Temperature (Avg)',
      this.canvasTemperature.nativeElement,
      data.map((d) => d.hour),
      data.map((d) => d.temperature),
    );
  }

  private renderGasResistanceChart(
    data: { hour: number; humidity: number; pressure: number; temperature: number; gasResistance: number }[],
  ): void {
    if (!this.canvasGasResistance) {
      return;
    }

    this.createChart(
      'Gas Resistance (Avg)',
      this.canvasGasResistance.nativeElement,
      data.map((d) => d.hour),
      data.map((d) => d.gasResistance),
    );
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
