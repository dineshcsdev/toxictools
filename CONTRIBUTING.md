# Contributing to ToxicTools

Welcome to ToxicTools! We're thrilled you're considering contributing to our open-source project. Our ethos is simple: "Build with zero investment but with a passion — contribute to this to help people." Every contribution, big or small, helps us make ToxicTools better and more accessible for everyone.

## Code of Conduct

To ensure a welcoming and inclusive environment for all, please review our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to adhere to these guidelines.

## Project Overview

ToxicTools is an open-source Flask web application designed for humorous and unfiltered AI interactions. It leverages the OpenRouter API, utilizing models like DeepSeek and FireLLaVA.

**Key Features:**
*   **Tools:** Roaster (text & image), Toxic Compliments, Apology Generator, AI Flirt.
*   **Language Support:** English, Tamil, and Tanglish (Tamil words written in English letters).
*   **UI/UX:** A distinct toxic green/black theme, single `script.js` for interactivity, and a single `style.css` for styling.
*   **Architecture:** Modular Flask backend with Jinja2 templates, clear routes, and dedicated API endpoints for each tool.
*   **Pages:** Story-focused Home (`/`), a dedicated Tools grid (`/tools`), individual tool pages, and a Contact page (`/contact`).

## Ways to Contribute

There are many ways you can contribute to ToxicTools, even if you're not a seasoned developer:

*   **Report Bugs:** If you find a bug, please open an issue.
*   **Suggest Features/Enhancements:** Have an idea for a new tool or an improvement? Let us know by opening an issue.
*   **Write Documentation:** Improve our `README.md`, `CONTRIBUTING.md`, or add user guides.
*   **Translate:** Help us expand language support or refine existing translations.
*   **Write Tests:** Contribute unit or integration tests to improve code reliability.
*   **Design:** Provide feedback or contribute design assets for UI/UX improvements.
*   **Code:** Fix bugs, implement new features, or refactor existing code.

## Local Development Setup

To get ToxicTools running on your local machine for development:

1.  **Fork the Repository:**
    Go to the [ToxicTools GitHub repository](https://github.com/dineshcsdev/ToxicTools) and click the "Fork" button.

2.  **Clone Your Fork:**
    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/ToxicTools.git
    cd ToxicTools
    ```
    (Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.)

3.  **Create a Virtual Environment:**
    It's highly recommended to use a virtual environment to manage dependencies.
    ```bash
    python -m venv venv
    source venv/bin/activate  # On macOS/Linux
    # venv\Scripts\activate   # On Windows
    ```

4.  **Install Dependencies:**
    Install the core application dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    If you plan to contribute to development (linting, testing), also install development dependencies:
    ```bash
    pip install -r requirements-dev.txt # (If you've created this file)
    ```

5.  **Set Up Environment Variables:**
    *   Obtain an `OPENROUTER_API_KEY` from [OpenRouter](https://openrouter.ai/).
    *   Create a file named `.env` in the root of your project directory.
    *   Add your API key to the `.env` file:
        ```
        OPENROUTER_API_KEY=your_key_here
        ```
        Replace `your_key_here` with your actual API key.

6.  **Run the Development Server:**
    ```bash
    flask run
    ```
    The application should now be accessible at `http://127.0.0.1:5000`.

## Branching and Commit Guidelines

*   **Branching:** Create a new branch for each feature or bug fix. Use descriptive names like `feature/add-new-tool` or `fix/bug-in-roaster`.
*   **Commit Messages:** Write clear, concise commit messages. A good practice is to use a prefix:
    *   `feat:` for new features
    *   `fix:` for bug fixes
    *   `docs:` for documentation changes
    *   `style:` for UI/UX or code style changes
    *   `refactor:` for code refactoring
    *   `test:` for adding or modifying tests
    *   `ci:` for CI/CD changes
    *   `chore:` for routine tasks (e.g., dependency updates)

## Issue and Pull Request Guidelines

### Reporting Bugs

*   Before opening a new issue, please search existing issues to see if the bug has already been reported.
*   If not, open a new issue and provide:
    *   A clear, descriptive title.
    *   Steps to reproduce the bug.
    *   Expected behavior.
    *   Actual behavior.
    *   Screenshots or error messages (if applicable).
    *   Your operating system and browser details.

### Suggesting Enhancements

*   Open a new issue to propose a new feature or enhancement.
*   Clearly describe the idea and why you think it would be valuable to the project.

### Submitting a Pull Request (PR)

1.  **Sync your fork** with the upstream `main` branch.
2.  **Create a new branch** for your changes.
3.  **Make your changes**, adhering to coding standards.
4.  **Test your changes** thoroughly.
5.  **Write clear commit messages.**
6.  **Push your branch** to your fork.
7.  **Open a Pull Request** to the `main` branch of the `dineshcsdev/ToxicTools` repository.

**PR Checklist:**
*   [ ] The PR has a clear, descriptive title.
*   [ ] The PR description explains the problem it solves or the feature it adds.
*   [ ] All new and existing tests pass.
*   [ ] Code adheres to the project's coding standards.
*   [ ] Documentation (if applicable) has been updated.
*   [ ] Changes are self-contained and focused on a single concern.

## Coding Standards

*   **Python (Flask):**
    *   Follow PEP 8 for code style.
    *   Keep routes and API endpoints modular.
    *   Ensure efficient data handling (O(1) lookups where possible).
*   **HTML/Jinja2:**
    *   Use semantic HTML.
    *   Maintain clear template inheritance (`{% extends "base.html" %}`).
*   **JavaScript:**
    *   Use a single `script.js` file.
    *   Scope code using container IDs (`if (document.getElementById('tool-id'))`).
    *   Utilize event delegation for efficiency.
    *   Avoid unnecessary DOM queries.
*   **CSS:**
    *   Adhere strictly to the toxic green/black color palette.
    *   Use CSS variables for colors.
    *   Ensure responsive design with mobile-first principles.
    *   Keep animations subtle and performant.
*   **Accessibility:** Prioritize accessible design (semantic HTML, sufficient color contrast, keyboard navigation).
*   **Performance:** Write efficient code that minimizes reflows and avoids blocking operations.
*   **Tanglish Handling:** When working with multilingual features, ensure the `get_lang_instruction` helper is used correctly and that AI prompts end with "Respond ONLY in {lang_instruction}".

## Testing Expectations

While not strictly enforced for all contributions, writing tests for new features and bug fixes is highly encouraged. This helps ensure the stability and reliability of the project.

## Security & Privacy Guidelines

*   **No Logging Sensitive Data:** Do not log API keys, user inputs, or AI responses on the server.
*   **No Storing User Data:** The application is designed to be stateless; no user data should be persistently stored.
*   **Input Sanitization:** Be mindful of potential XSS vulnerabilities when displaying AI output. Ensure AI responses are properly sanitized or inserted as plain text into the DOM.
*   **Dependency Security:** Keep dependencies updated to avoid known vulnerabilities.

## Acknowledgment and Recognition

We appreciate every contribution! All contributors will be acknowledged in the project's `README.md` (or a dedicated `AUTHORS.md` file if the project grows). Your name will be added to the list of contributors on GitHub.

Thank you for helping us build ToxicTools!
