document.addEventListener('DOMContentLoaded', () => {
    // --- Language Selector Logic (Global) ---
    const langSelectors = document.querySelectorAll('.lang-selector');

    langSelectors.forEach(selector => {
        selector.addEventListener('click', (event) => {
            if (event.target.classList.contains('lang-btn')) {
                // Remove active from all buttons in this selector
                selector.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
                // Add active to the clicked button
                event.target.classList.add('active');
            }
        });
    });

    // --- Helper function to display response/error with animation and manage copy button ---
    function displayResponse(container, message, isError = false) {
        const copyBtn = container.nextElementSibling; // Assuming copy button is next sibling
        if (copyBtn && copyBtn.classList.contains('copy-btn')) {
            copyBtn.style.display = isError ? 'none' : 'inline-block'; // Show copy button only on success
        }
        container.innerHTML = `<div class="response-content"><p class="${isError ? 'error-message' : ''}">${message}</p></div>`;
    }

    // --- Copy to Clipboard Functionality ---
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const textToCopy = targetElement.textContent.trim();
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy text.');
                });
            }
        });
    });

    // --- Tool-Specific Scoping and Logic ---

    // Roaster Tool Logic
    if (document.getElementById('roast-tool')) {
        const uploadArea = document.getElementById('upload-area');
        const imageUpload = document.getElementById('image-upload');
        const uploadPrompt = document.getElementById('upload-prompt');
        const imagePreviewContainer = document.getElementById('image-preview-container');
        const imagePreview = document.getElementById('image-preview');
        const removeImageBtn = document.getElementById('remove-image-btn');
        const userInput = document.getElementById('user-input');
        const roastBtn = document.getElementById('roast-btn');
        const responseContainer = document.querySelector('#roast-tool #response-container');

        let selectedImageFile = null;

        // Click to open file dialog
        uploadArea.addEventListener('click', () => {
            imageUpload.click();
        });

        // Handle file selection via input
        imageUpload.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                handleImageFile(files[0]);
            }
        });

        // Drag and Drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
        });

        uploadArea.addEventListener('drop', (event) => {
            const dt = event.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                handleImageFile(files[0]);
            }
        }, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function handleImageFile(file) {
            if (file.type.startsWith('image/')) {
                selectedImageFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    uploadPrompt.style.display = 'none';
                    imagePreviewContainer.style.display = 'flex'; // Use flex to center content
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload an image file.');
            }
        }

        removeImageBtn.addEventListener('click', () => {
            selectedImageFile = null;
            imageUpload.value = ''; // Clear the input
            imagePreview.src = '';
            uploadPrompt.style.display = 'block';
            imagePreviewContainer.style.display = 'none';
        });

        // Roast button click handler
        roastBtn.addEventListener('click', handleRoast);

        // Enter key on input triggers roast
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleRoast();
            }
        });

        async function handleRoast() {
            const input = userInput.value.trim();
            const selectedLangBtn = document.querySelector('#roast-tool .lang-btn.active');
            const language = selectedLangBtn ? selectedLangBtn.dataset.lang : 'English';

            if (!input && !selectedImageFile) {
                displayResponse(responseContainer, 'Please enter text or upload an image.', true);
                return;
            }

            responseContainer.innerHTML = '<div class="loader"></div>'; // Show loader

            const formData = new FormData();
            formData.append('user_input', input);
            formData.append('language', language);
            if (selectedImageFile) {
                formData.append('image', selectedImageFile);
            }

            try {
                const response = await fetch('/api/roast', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    displayResponse(responseContainer, data.response);
                } else {
                    displayResponse(responseContainer, `Error: ${data.error || 'Something went wrong.'}`, true);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                displayResponse(responseContainer, 'Network error. Please try again.', true);
            }
        }
    }

    // Generic API Call Handler for Compliment, Apology, Flirt Tools
    const setupTool = (toolId, apiUrl) => {
        if (document.getElementById(toolId)) {
            const userInput = document.querySelector(`#${toolId} #user-input`);
            const generateBtn = document.querySelector(`#${toolId} #generate-btn`);
            const responseContainer = document.querySelector(`#${toolId} #response-container`);

            if (!userInput || !generateBtn || !responseContainer) {
                console.error(`Missing elements for tool: ${toolId}`);
                return;
            }

            const handleGenerate = async () => {
                const input = userInput.value.trim();
                const selectedLangBtn = document.querySelector(`#${toolId} .lang-btn.active`);
                const language = selectedLangBtn ? selectedLangBtn.dataset.lang : 'English';

                if (!input) {
                    displayResponse(responseContainer, 'Please enter some text.', true);
                    return;
                }

                responseContainer.innerHTML = '<div class="loader"></div>'; // Show loader

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_input: input,
                            language: language,
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        displayResponse(responseContainer, data.response);
                    } else {
                        displayResponse(responseContainer, `Error: ${data.error || 'Something went wrong.'}`, true);
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                    displayResponse(responseContainer, 'Network error. Please try again.', true);
                }
            };

            generateBtn.addEventListener('click', handleGenerate);
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    handleGenerate();
                }
            });
        }
    };

    setupTool('compliment-tool', '/api/toxic-compliment');
    setupTool('apology-tool', '/api/apology');
    setupTool('flirt-tool', '/api/ai-flirt');

    // --- Mouse tracking for radial glow on tool cards (only on /tools page) ---
    // Check if the tool-grid exists, which indicates the /tools page
    if (document.querySelector('.tool-grid')) {
        const toolCards = document.querySelectorAll('.tool-card');

        toolCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mx', `${x}px`);
                card.style.setProperty('--my', `${y}px`);
            });
        });
    }

    // --- Contact Page Logic ---
    if (document.getElementById('contact-page')) {
        const contactForm = document.getElementById('contact-form');
        const formMessageDiv = document.getElementById('form-message');

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent actual form submission

            // Basic client-side validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                displayResponse(formMessageDiv, 'Please fill in all required fields.', true);
                formMessageDiv.style.display = 'block';
                return;
            }

            // Simulate form submission success
            displayResponse(formMessageDiv, 'Message sent successfully! We will get back to you soon.');
            formMessageDiv.style.display = 'block';
            contactForm.reset(); // Clear the form

            // Hide message after a few seconds
            setTimeout(() => {
                formMessageDiv.style.display = 'none';
            }, 5000);
        });

        // FAQ Accordion Logic
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling; // The .faq-answer div
                // Toggle active class on the answer
                answer.classList.toggle('active');
            });
        });
    }
});
