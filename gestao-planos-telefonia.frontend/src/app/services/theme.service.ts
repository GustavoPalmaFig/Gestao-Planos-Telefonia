import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  selectedTheme = signal<string>('light');

  toggleTheme() {
    this.selectedTheme.update(value => value === 'dark' ? 'light' : 'dark');
    this.applyTheme(this.selectedTheme());
  }

  setTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.selectedTheme.set(savedTheme);
    this.applyTheme(savedTheme);
  }

  applyTheme(theme: string) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }
}