/**
 * Manages the execution, undoing, and redoing of commands.
 */
export class CommandManager {
    constructor () {
        this.undoStack = [];
        this.redoStack = [];
    }

    /**
     * Executes a command and adds it to the undo stack.
     * @param {} command The command to execute.
     */
    execute(command) {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = []; // Clear the redo stack whenever a new action is performed.
    }

    /**
     * Undoes the last command.
     */
    undo() {
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    /**
     * Redoes the last undone command.
     */
    redo() {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }
}
