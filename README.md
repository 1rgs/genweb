# 🧪 genweb: generative full stack web framework 🧪

### backend ❌ frontend ❌ database ❌ llm ✅

genweb allows you to build full stack applications with natrual language. Unlike other codegen tools, genweb generates the user interface html directly, without outputting any backend or frontend framework code.

Any user interactions are piped back to the llm, which "rerenders" the html as necessary, as a web framework like react would.

this is a proof of concept of software 2.0, and is not ready for production.

![tweet](images/tweet.png)

## Here's how genweb compares to traditional web development:
![gfx](images/gfx.png)



## Every user session is a multi-turn LLM conversation. Here's an example of a user session:

| Step | Content |
|--------------|---------|
| Application "source code" definition | You are an AI assistant simulating a web application. Below is the application I want you to simulate:<br><br><div style="background-color: #77DD77; padding: 10px;">A todo list application where users can:<br>1. Add new tasks<br>2. Mark tasks as complete<br>3. Delete tasks<br>4. Filter tasks by status (all, active, completed)</div><br>Generate full HTML for this application. Always add CSS styling, but put it at the end of the body in a &lt;style&gt; tag. Follow these guidelines:... |
| Assistant generates initial HTML based on the application specification |  <pre style="background-color: #87CEEB; padding: 10px;">&lt;html&gt;<br>&lt;head&gt;<br>    &lt;title&gt;Todo List&lt;/title&gt;<br>&lt;/head&gt;<br>&lt;body&gt;<br>    &lt;h1&gt;Todo List&lt;/h1&gt;<br>    &lt;form id="todo-form"&gt;<br>        &lt;input id="task-input" name="task"&gt;<br>        &lt;button&gt;Add Task&lt;/button&gt;<br>    &lt;/form&gt;<br>    &lt;ul id="task-list"&gt;&lt;/ul&gt;<br>    &lt;select id="filter-status"&gt;<br>        &lt;option value="all"&gt;All&lt;/option&gt;<br>        &lt;option value="active"&gt;Active&lt;/option&gt;<br>        &lt;option value="completed"&gt;Completed&lt;/option&gt;<br>    &lt;/select&gt;<br>&lt;/body&gt;<br>&lt;/html&gt;
</pre>User interaction - user adds task to todo list | The user interacted with the element with ID "todo-form". This element is part of a form, and the form data is: {"task":"buy fruit"}. Based on this interaction and the current state of the application, generate the appropriate full HTML content. Remember to include all necessary HTML tags and CSS styling. |
| LLM updates the HTML to include the new task "buy fruit" with options to mark it as complete or delete it. | <pre style="background-color: #87CEEB; padding: 10px;">&lt;html&gt;<br>&lt;head&gt;<br>    &lt;title&gt;Todo List&lt;/title&gt;<br>&lt;/head&gt;<br>&lt;body&gt;<br>    &lt;h1&gt;Todo List&lt;/h1&gt;<br>    &lt;form id="todo-form"&gt;<br>        &lt;input id="task-input" name="task"&gt;<br>        &lt;button&gt;Add Task&lt;/button&gt;<br>    &lt;/form&gt;<br>    &lt;ul id="task-list"&gt;<br>        <span style="background-color: #ffff00;">&lt;li&gt;<br>            &lt;span&gt;New: buy fruit&lt;/span&gt;<br>            &lt;button id="complete-0"&gt;Complete&lt;/button&gt;<br>            &lt;button id="delete-0"&gt;Delete&lt;/button&gt;<br>        &lt;/li&gt;</span><br>    &lt;/ul&gt;<br>    &lt;select id="filter-status"&gt;<br>        &lt;option value="all"&gt;All&lt;/option&gt;<br>        &lt;option value="active"&gt;Active&lt;/option&gt;<br>        &lt;option value="completed"&gt;Completed&lt;/option&gt;<br>    &lt;/select&gt;<br>&lt;/body&gt;<br>&lt;/html&gt;
</pre>User marks the task as complete | The user interacted with the element with ID "complete-0". Based on this interaction and the current state of the application, generate the appropriate full HTML content. Remember to include all necessary HTML tags and CSS styling. | |
| LLM updates the HTML to show the "buy fruit" task as completed and removes the "Complete" button. | <pre style="background-color: #87CEEB; padding: 10px;">&lt;html&gt;<br>&lt;head&gt;<br>    &lt;title&gt;Todo List&lt;/title&gt;<br>&lt;/head&gt;<br>&lt;body&gt;<br>    &lt;h1&gt;Todo List&lt;/h1&gt;<br>    &lt;form id="todo-form"&gt;<br>        &lt;input id="task-input" name="task"&gt;<br>        &lt;button&gt;Add Task&lt;/button&gt;<br>    &lt;/form&gt;<br>    &lt;ul id="task-list"&gt;<br>        &lt;li&gt;<br>            <span style="background-color: #ffff00;">&lt;span&gt;Completed: buy fruit&lt;/span&gt;<br>            &lt;button id="delete-0"&gt;Delete&lt;/button&gt;</span><br>        &lt;/li&gt;<br>    &lt;/ul&gt;<br>    &lt;select id="filter-status"&gt;<br>        &lt;option value="all"&gt;All&lt;/option&gt;<br>        &lt;option value="active"&gt;Active&lt;/option&gt;<br>        &lt;option value="completed"&gt;Completed&lt;/option&gt;<br>    &lt;/select&gt;<br>&lt;/body&gt;<br>&lt;/html&gt;
</pre> |
