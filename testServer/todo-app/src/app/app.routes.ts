import { Routes } from '@angular/router';
import { Todo } from './todo/todo';
import { Home } from './home/home';
export const routes: Routes = [
    {
        path: 'todo',
        component: Todo,
    },
    {
        path: 'home',
        component: Home,
    },
];
