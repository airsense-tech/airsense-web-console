import { bootstrapApplication } from '@angular/platform-browser';
import { Chart } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

Chart.register(zoomPlugin);
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
