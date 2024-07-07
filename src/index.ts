import { Hono } from 'hono';
import Together from 'together-ai';

interface Env {
	TOGETHER_API_KEY: string;
	SESSION_STORE: KVNamespace;
}

interface SessionState {
	messages: { role: string; content: string }[];
}

const app = new Hono<{ Bindings: Env }>();

// Application-specific prompt (user only needs to change this)
const APPLICATION_CODE = `
A todo list application where users can:
1. Add new tasks
2. Mark tasks as complete
3. Delete tasks
4. Filter tasks by status (all, active, completed)
`;

const SYSTEM_PROMPT = `
You are an AI assistant simulating a web application. Below is the application I want you to simulate:

${APPLICATION_CODE}

Generate full HTML for this application. Always add CSS styling, but put it at the end of the body in a <style> tag. Follow these guidelines:

1. Create a complete, valid HTML document with <!DOCTYPE html>, <html>, <head>, and <body> tags.
2. Add unique IDs to every interactive element (buttons, inputs, etc.) so that user interactions can be tracked.
3. Do not include any JavaScript in your response, as all interactivity will be handled by the backend.
4. Ensure the application is visually appealing and user-friendly.
5. For each user interaction, update the HTML to reflect the new state of the application.
6. Maintain consistency in the UI elements and their IDs across interactions.
7. When processing form submissions or button clicks within forms, use the provided form data to update the application state.
8. For forms, add a name attribute to each input element to identify the data when the form is submitted.
9. Just return the HTML content, do not use start with \`\`\` or end with \`\`\` in your response. Do not include any other content in your response.

Remember, you are simulating the entire application, so you need to keep track of the application state and update it appropriately with each interaction.
`;

const frontend = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LLM-powered Web App</title>
    <script>
        function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = generateUUID();
            sessionStorage.setItem('sessionId', sessionId);
        }

        function fixIncompleteHTML(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.body.innerHTML;
        }

        function handleInteraction(elementId, formData = null) {
            console.log('handleInteraction called:', elementId, formData);
            fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId, elementId, formData }),
            })
            .then(response => {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                function processStream({ done, value }) {
                    if (done) {
                        document.body.innerHTML = fixIncompleteHTML(buffer);
                        attachEventListeners();
                        return;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    document.body.innerHTML = fixIncompleteHTML(buffer);
                    attachEventListeners();

                    return reader.read().then(processStream);
                }

                return reader.read().then(processStream);
            });
        }

        function attachEventListeners() {
            document.querySelectorAll('button, input[type="submit"]').forEach(element => {
                element.addEventListener('click', handleElementClick);
            });

            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', handleFormSubmit);
            });
        }

        function handleElementClick(event) {
            const element = event.target.closest('button, input[type="submit"]');
            if (element) {
                event.preventDefault();
                event.stopPropagation();

                const form = element.closest('form');
                if (form) {
					const data = new FormData(form);
					handleInteraction(form.id || 'unnamed-form', Object.fromEntries(data.entries()));
                } else {
                    handleInteraction(element.id || 'unnamed-button');
                }
            }
        }

        function handleFormSubmit(event) {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log('Form submitted, data:', data);
            handleInteraction(form.id || 'unnamed-form', data);
        }

        window.onload = function() {
            handleInteraction('initial');
        };
    </script>
</head>
<body>
    <!-- Content will be dynamically inserted here -->
</body>
</html>`;

app.get('/', (c) => {
	return c.html(frontend);
});

app.post('/', async (c) => {
	const { sessionId, elementId, formData } = await c.req.json();

	console.log('Received POST request:', { sessionId, elementId, formData });

	let sessionState: SessionState = { messages: [] };

	if (elementId !== 'initial') {
		const storedState = await c.env.SESSION_STORE.get(sessionId);
		if (storedState) {
			sessionState = JSON.parse(storedState);
		}
	}

	const together = new Together({ apiKey: c.env.TOGETHER_API_KEY });

	let userMessage: string;

	if (elementId === 'initial') {
		userMessage = SYSTEM_PROMPT;
	} else if (formData && Object.keys(formData).length > 0) {
		userMessage = `The user interacted with the element with ID "${elementId}". This element is part of a form, and the form data is: ${JSON.stringify(
			formData
		)}. Based on this interaction and the current state of the application, generate the appropriate full HTML content. Remember to include all necessary HTML tags and CSS styling.`;
	} else {
		userMessage = `The user interacted with the element with ID "${elementId}". Based on this interaction and the current state of the application, generate the appropriate full HTML content. Remember to include all necessary HTML tags and CSS styling.`;
	}

	console.log('User message:', userMessage);

	sessionState.messages.push({ role: 'user', content: userMessage });

	const stream = await together.chat.completions.create({
		model: 'meta-llama/Llama-3-8b-chat-hf',
		messages: sessionState.messages,
		stream: true,
	});

	let assistantMessage = '';

	const responseStream = new ReadableStream({
		async start(controller) {
			for await (const chunk of stream) {
				const content = chunk.choices[0].delta.content;
				if (content) {
					assistantMessage += content;
					controller.enqueue(new TextEncoder().encode(content));
				}
			}

			sessionState.messages.push({ role: 'assistant', content: assistantMessage });
			await c.env.SESSION_STORE.put(sessionId, JSON.stringify(sessionState));

			controller.close();
		},
	});

	return new Response(responseStream, {
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Transfer-Encoding': 'chunked',
		},
	});
});

export default app;
