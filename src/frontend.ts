export const frontendHTML = `
<!DOCTYPE html>
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
</html>
`;
