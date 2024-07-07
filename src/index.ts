import { createGenwebApp } from './main';

export default createGenwebApp(`
An emoji todo list application where users can:
1. Add new tasks
3. Delete tasks

Can you start with the following tasks:
- buy groceries
- walk the dog
- do laundry

Translate every task into multiple emojis. For example, "buy groceries" could be 🍎🍞🥦, and prepend it to the task name.
`);
