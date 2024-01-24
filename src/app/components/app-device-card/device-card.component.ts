import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ImageService } from '../../services/assets/image.service';
import { LogService } from '../../services/logging/log.service';
import { SkeletonComponent } from '../skeleton/skeleton.component';

/**
 * Represents a card for a single device.
 * A device card has an image of the device location and a name.
 */
@Component({
  selector: 'app-device-card',
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
    SkeletonComponent,
  ],
  templateUrl: './device-card.component.html',
})
export class DeviceCardComponent implements OnInit {
  /**
   * The device id.
   */
  @Input()
  public deviceId: string = '';

  /**
   * The device name.
   */
  @Input()
  public deviceName: string = '';

  /**
   * The internal image blob displayed in the card.
   */
  protected imgBlob: SafeUrl = '';

  /**
   * Constructor.
   *
   * @param log The log service.
   * @param imageService The image service.
   * @param sanitizer The DOM sanitizer.
   */
  constructor(
    private log: LogService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) {}

  /**
   * Angular's lifecycle hook for component initialization.
   */
  public async ngOnInit(): Promise<void> {
    this.selectImage(this.deviceName);
  }

  private async selectImage(device: string): Promise<void> {
    const searchTerm = device.toLowerCase().trim();

    if (searchTerm.includes('living')) {
      this.fetchImage('living-room');
    } else if (searchTerm.includes('bed')) {
      this.fetchImage('bed-room');
    } else if (searchTerm.includes('kitchen')) {
      this.fetchImage('kitchen');
    } else if (searchTerm.includes('bath')) {
      this.fetchImage('bath-room');
    } else if (searchTerm.includes('office')) {
      this.fetchImage('office');
    } else if (searchTerm.includes('basement')) {
      this.fetchImage('basement');
    } else {
      this.fetchImage('placeholder');
    }
  }

  /**
   * Fetches the image for the device.
   */
  private async fetchImage(image: string): Promise<void> {
    try {
      const img = await this.imageService.fetchImage(image);

      if (!img || !img.body) {
        this.log.warn(`failed to fetch image: ${image}`);
        return;
      }

      const objectUrl = URL.createObjectURL(img.body);
      this.imgBlob = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    } catch (error) {
      this.log.error(error);
    }
  }
}
