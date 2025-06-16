import { Component } from '@angular/core';

@Component({
    selector: 'app-todo',
    imports: [],
    templateUrl: './todo.html',
    styleUrl: '../app.css',
})
export class Todo {
    todos: string[] = [];
    newTodo: string = '';

    addTodo() {
        console.log('todo submitted');
        if (this.newTodo.trim()) {
            this.todos.push(this.newTodo.trim());
            this.newTodo = '';
        }
    }

    removeTodo(index: number) {
        this.todos.splice(index, 1);
    }
}
