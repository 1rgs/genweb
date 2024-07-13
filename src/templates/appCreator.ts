export const AppTemplate = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Genweb App Creator</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
        <main class="w-full max-w-md">
        <form action="/" method="post" class="bg-white shadow-md px-[25px] py-[38px] rounded-[8px]">
                <header class="mb-8 text-center">
                    <h1 class="text-4xl font-bold">Genweb</h1>
                </header>
                <hr class="mb-8" />
                <div class="mb-4">
                    <div class="flex items-center">
                    <label for="appDescription" class="block text-gray-700 font-bold text-sm mb-2">
                        App description
                    </label>
                    </div>
                    <textarea
                        id="appDescription" 
                        name="appDescription" 
                        rows="5"
                        class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground placeholder:text-xs placeholder:italic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe your app here..."
                    ></textarea>
                </div>
                <div class="flex items-center">
                    <button 
                        type="submit" 
                        id="generateApp"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#e4f222] text-[#1f1f1f] hover:opacity-75 px-4 py-2"
                    >
                        Generate App
                    </button>
                </div>
            </form>

            <div class="bg-white shadow-md px-[5px] py-[10px] mt-5 rounded-[8px]">
                <div class="rounded-[8px] p-2">
                    <div class="flex justify-between items-center px-2">
                        <h2 class="text-sm font-bold">Examples</h2>
                        <div class="self-end">
                            <button id="todoApp" class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-primary-foreground hover:bg-primary/80">
                                To-Do App
                            </button>

                            <button id="calendar" class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-primary-foreground hover:bg-primary/80">
                                Calendar
                            </button>

                            <button id="wordle" class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-primary-foreground hover:bg-primary/80">
                                Wordle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </body>
</html>

<script>
    const todoApp = document.getElementById('todoApp');
    const calendar = document.getElementById('calendar');
    const wordle = document.getElementById('wordle');

    todoApp.addEventListener('click', () => {
        appDescription.value = \`An emoji todo list application where users can:
1. Add new tasks
2. Delete tasks

Can you start with the following tasks:
- buy groceries
- walk the dog
- do laundry

Translate every task into multiple emojis. For example, "buy groceries" could be 🍎🍞🥦, and prepend it to the task name.
        \`;
    });

    calendar.addEventListener('click', () => {
        appDescription.value = \`A weekly calendar application that allows users to add, edit, and delete events. 
The application should display a monthly calendar view with the current month and year at the top.
Below the calendar, there should be a form to add a new event. 

The form should include the following fields:
    - Event name (text input)
    - Event Day (dropdown with days of the week)
    - Event start time (time input)

The calendar should display each day of the month in a grid format.
Also display the events for each day in the grid.
Each event should show the event name and start time.
        \`;
    });

    wordle.addEventListener('click', () => {
        appDescription.value = \`A wordle game application where users can:
- Guess a 5-letter word
- See how many letters are correct
- See how many letters are in the correct position

The application should generate a random 5-letter word for the user to guess.
After a guess is made, the application should display how many letters are correct and how many are in the correct position.
Yellow means the letter is correct but in the wrong position.
Green means the letter is correct and in the correct position.
Gray means the letter is not in the word.
        \`;
    });
</script>
`;
