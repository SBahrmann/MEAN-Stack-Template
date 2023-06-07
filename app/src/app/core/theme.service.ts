import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { HostBinding, Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {

    @HostBinding('class') public componentCssClass: string = '';
    private viewValue: string | null = localStorage.getItem('view');
    public view: boolean = (this.viewValue) ? JSON.parse(this.viewValue) : false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        public overlayContainer: OverlayContainer,
    ) { }

    public toggleTheme(): void {
        this.view = !this.view;
        localStorage.setItem('view', this.view.toString());
        this.setDesign();
    }

    public setDesign(): void {
        if (!localStorage.getItem('view') && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.view = true;
            this.componentCssClass = 'dark-theme';
            this.document.body.classList.remove('default-theme');
            this.document.body.classList.add('dark-theme');
            localStorage.setItem('view', this.view.toString());
        } else if (this.view) {
            this.componentCssClass = 'dark-theme';
            this.document.body.classList.remove('default-theme');
            this.document.body.classList.add('dark-theme');
        } else {
            this.componentCssClass = 'default-theme';
            this.document.body.classList.remove('dark-theme');
            this.document.body.classList.add('default-theme');
        }
    }
}