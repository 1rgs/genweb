import { createLLMWebApp } from './backend';
import { frontendHTML } from './frontend';

export function createApp(applicationCode: string) {
	const systemPrompt = `
You are an AI assistant simulating a web application. Below is the application I want you to simulate:

${applicationCode}

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
10. You don't need to pretty print the HTML.

Remember, you are simulating the entire application, so you need to keep track of the application state and update it appropriately with each interaction.
`;

	return createLLMWebApp(systemPrompt, frontendHTML);
}
