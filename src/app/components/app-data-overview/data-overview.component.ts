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
import { HumidityService } from '../../services/backend/humidity.service';
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

  @ViewChild('dataCanvas', { static: true })
  public dataCanvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(
    private log: LogService,
    private humidityService: HumidityService,
  ) {}

  public async ngAfterContentInit(): Promise<void> {
    if (!this.dataCanvas) {
      return;
    }

    try {
      const humidityData = await this.humidityService.pull();
      this.renderHumidityChart(humidityData);
    } catch (error) {
      this.log.error(error);
    }
  }

  private renderHumidityChart(data: { hour: number; humidity: number }[]): void {
    if (!this.dataCanvas) {
      return;
    }

    new Chart(this.dataCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((point) => point.hour),
        datasets: [
          {
            label: 'Humidity',
            data: data.map((point) => point.humidity),
          },
        ],
      },
      options: {
        responsive: false,
      },
    });
  }
}
