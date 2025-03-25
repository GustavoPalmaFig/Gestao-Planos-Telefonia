import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private readonly MOBILE_MAX_WIDTH = 992;
  private screenWidth: number = window.innerWidth;
  public isMobile = signal<boolean>(this.screenWidth <= this.MOBILE_MAX_WIDTH);

  constructor() {
    const mediaQuery = window.matchMedia(`(max-width: ${this.MOBILE_MAX_WIDTH}px)`);
    this.setIsMobile(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', (event) => {
        this.setIsMobile(event.matches);
    });
   }

    setIsMobile(matches: boolean) {
        this.isMobile.set(matches);
    }
}   
