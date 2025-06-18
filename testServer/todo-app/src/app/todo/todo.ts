import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-todo',
    imports: [],
    templateUrl: './todo.html',
    styleUrl: '../app.css',
})
export class Todo {
    // todos: string[] = [];
    // newTodo: string = '';
    todos = signal<string[]>([]);

    newTodo = signal<string>('');

    updateNewTodo(e: Event) {
        e.preventDefault();

        if (this.newTodo() === '') return;

        console.log('Clicked mee');

        this.todos.update((t) => [...t, this.newTodo()]);

        this.newTodo.set('');

        return 'Updated todo list';
    }

    newTask(e: Event) {
        let currentValue = (e.target as HTMLInputElement).value.trim();
        console.log((e.target as HTMLInputElement).value);
        // this.newTodo = (e.target as HTMLInputElement).value.trim();
        this.newTodo.set(currentValue);
    }
}
