import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SidebarComponent } from '../app-sidebar/sidebar.component';

/**
 * The toolbar component.
 * Represents the application toolbar at the top of the screen.
 */
@Component({
  selector: 'app-toolbar',
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
    MatSidenavModule,
  ],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  /**
   * A reference to the sidebar container component.
   */
  @Input()
  public sidebar: SidebarComponent | undefined;

  /**
   * Constructor.
   *
   * @param authService The authentication service.
   */
  constructor(private authService: AuthService) {}

  /**
   * Logs the user out.
   */
  public async logout(): Promise<void> {
    await this.authService.logout();
  }

  /**
   * Toggles the sidebar.
   */
  public toggleSidebar(): void {
    this.sidebar?.toggle();
  }

  /**
   * Indicates whether the user is authenticated.
   */
  protected get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
