import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingService } from './services/loading.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarModule, ButtonModule, ToastModule, TooltipModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  protected loadingService = inject(LoadingService);
  protected themeService = inject(ThemeService);
  protected isResponsiveMode: boolean = false;

  navigate(address: string) {
    this.router.navigate([address]);
  }

  ngOnInit() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    this.isResponsiveMode = mediaQuery.matches;
    
    mediaQuery.addEventListener('change', (event) => {
      this.isResponsiveMode = event.matches;
    });

    this.themeService.setTheme();
  }
}