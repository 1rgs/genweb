import { createApp } from './main';

const APPLICATION_CODE = `
A todo list application where users can:
1. Add new tasks
2. Mark tasks as complete
3. Delete tasks
4. Filter tasks by status (all, active, completed)

Can you start with the following tasks:
- buy groceries
- walk the dog
- do laundry
`;

export default createApp(APPLICATION_CODE);
