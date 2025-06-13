import { Component, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const name: signal<string> = signal('Devvrat');

@Component({
    selector: 'app-root',
    template: `
        <div class="text-white flex flex-column bg-black h-screen w-full">
            Hihiasdkljasdhlk
        </div>
    `,
    styleUrl: './app.css',
})
export class App {
    protected title = 'my-first-app';
}
