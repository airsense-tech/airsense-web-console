import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { BackgroundComponent } from './components/app-background/background.component';
import { SidebarComponent } from './components/app-sidebar/sidebar.component';
import { ToolbarComponent } from './components/app-toolbar/toolbar.component';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({
      position: 'relative',
      width: '100%',
      height: '100%',
    }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }),
      ],
      { optional: true },
    ),
    query(':enter', [style({ left: '-100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('500ms ease-in-out', style({ left: '100%', opacity: 0 }))], { optional: true }),
      query(':enter', [animate('500ms ease-in-out', style({ left: '0%' }))], { optional: true }),
      query('@*', animateChild(), { optional: true }),
    ]),
  ]),
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    ToolbarComponent,
    MatSidenavModule,
    SidebarComponent,
    BackgroundComponent,
  ],
  templateUrl: './app.component.html',
  animations: [slideInAnimation],
})
export class AppComponent {
  public title = 'airsense-web-console';

  constructor(private contexts: ChildrenOutletContexts) {}

  protected getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
