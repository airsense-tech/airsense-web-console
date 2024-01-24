import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { RegisterService } from '../../services/backend/register.service';
import { LogService } from '../../services/logging/log.service';

@Component({
  selector: 'app-register',
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
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  protected firstName: string | undefined;
  protected lastName: string | undefined;
  protected email: string | undefined;
  protected password: string | undefined;

  /**
   * Constructor.
   *
   * @param log The log service.
   * @param registerService The register service.
   * @param router The router.
   */
  constructor(
    private log: LogService,
    private registerService: RegisterService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  public async register(): Promise<void> {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      return;
    }

    try {
      await this.registerService.register(this.firstName, this.lastName, this.email, this.password);
      await this.router.navigate(['/login']);
    } catch (error) {
      this.log.error(error);
      this.snackBar.open("Sorry, that didn't work! Try again later :(", 'Ok', {
        duration: 5000,
        panelClass: ['bg-white'],
      });
    }
  }
}
