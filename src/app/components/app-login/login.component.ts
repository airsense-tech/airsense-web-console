import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/backend/login.service';
import { LogService } from '../../services/logging/log.service';

/**
 * The login component.
 */
@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  /**
   * The email entered by the user (two-way binding).
   */
  protected email: string | undefined;

  /**
   * The password entered by the user (two-way binding).
   */
  protected password: string | undefined;

  /**
   * Whether the user has accepted the terms and conditions (two-way binding).
   */
  protected termsAccepted: boolean = false;

  constructor(
    private log: LogService,
    private loginService: LoginService,
    private router: Router,
  ) {}

  public async login(): Promise<void> {
    if (!this.email || !this.password) {
      return;
    }

    try {
      await this.loginService.login(this.email, this.password);
      await this.router.navigate(['/devices']);
    } catch (error) {
      this.log.error(error);
    }
  }
}
