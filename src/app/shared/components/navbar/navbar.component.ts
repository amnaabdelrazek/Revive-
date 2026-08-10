import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = false;
  avatarUrl: string | null = null;

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.avatarUrl = this.authService.getAvatarUrl();

    if (this.isLoggedIn) {
      this.authService.getUserProfile().subscribe({
        next: (res) => {
          const rawUrl = res?.body?.avatar_url;
          if (rawUrl) {
            this.authService.saveAvatarUrl(rawUrl);
            this.avatarUrl = this.authService.getAvatarUrl();
          }
        },
        error: () => {}
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
  isMobileMenuOpen = false;

toggleMobileMenu(): void {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}

closeMobileMenu(): void {
  this.isMobileMenuOpen = false;
}
}
