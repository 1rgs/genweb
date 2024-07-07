import { Hono } from 'hono';
import Together from 'together-ai';

interface Env {
	TOGETHER_API_KEY: string;
	SESSION_STORE: KVNamespace;
}

interface SessionState {
	messages: { role: string; content: string }[];
}

export function createLLMWebApp(systemPrompt: string, frontendHTML: string) {
	const app = new Hono<{ Bindings: Env }>();

	app.get('/', (c) => c.html(frontendHTML));

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
			userMessage = systemPrompt;
		} else if (formData && Object.keys(formData).length > 0) {
			userMessage = `The user interacted with the element with ID "${elementId}". This element is part of a form, and the form data is: ${JSON.stringify(
				formData
			)}. Based on this interaction and the current state of the application, generate the appropriate full HTML content. Remember to include all necessary HTML tags and CSS styling.`;
		} else {
			userMessage = `The user interacted with the element with ID "${elementId}". Based on this interaction and the current state of the application, generate the appropriate full HTML content. Remember to include all necessary HTML tags and CSS styling.`;
		}

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

				// print the entire conversation
				console.log('Conversation:', sessionState.messages);

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

	return app;
}
