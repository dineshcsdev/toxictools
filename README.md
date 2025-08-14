# ToxicTools
 **Live Demo:** [https://toxictools.pythonanywhere.com](https://toxictools.pythonanywhere.com)

**Brutally honest AI, built for fun — and for the people.**

ToxicTools is an open-source web application that leverages AI to provide humorous, unfiltered, and witty responses. It's designed for entertainment and offers a unique perspective on everyday interactions, all within a distinct toxic green/black aesthetic.

## Features

*   **AI-Powered Tools:** Engage with various AI models for different purposes:
    *   **Roaster:** Get vicious, witty roasts for text or images.
    *   **Toxic Compliments:** Receive backhanded compliments that sting.
    *   **Apology Generator:** Craft sincere and concise apologies.
    *   **AI Flirt:** Generate playful and cheeky pickup lines.
*   **Multilingual Support:** Interact with tools in English, Tamil, and Tanglish (Tamil words written in English letters).
*   **Distinct UI/UX:** Enjoy a consistent toxic green/black theme with subtle animations, card-based layouts, and neon hover effects.
*   **Open-Source Ethos:** Built with transparency and community contributions in mind.

## Getting Started

Follow these steps to get ToxicTools up and running on your local machine.

### Prerequisites

*   Python 3.9+ (recommended)
*   pip (Python package installer)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dineshcsdev/ToxicTools.git
    cd ToxicTools
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(If `requirements.txt` is not present, generate it first by running `pip freeze > requirements.txt` after installing Flask, python-dotenv, and openai.)*

4.  **Configure your OpenRouter API Key:**
    *   Obtain an API key from [OpenRouter](https://openrouter.ai/).
    *   Create a file named `.env` in the root of the `ToxicTools` directory.
    *   Add your API key to the `.env` file like this:
        ```
        OPENROUTER_API_KEY=your_key_here
        ```
        Replace `your_key_here` with your actual API key.

### Running the Application

```bash
flask run
```

Alternatively, you can run it directly:

```bash
python app.py
```

Once the server is running, open your web browser and navigate to `http://127.0.0.1:5000`.

## Usage

*   **Home Page:** Learn about the project's mission, vision, and roadmap.
*   **Tools Page:** Explore and interact with the various AI-powered tools.
*   **Contact Page:** Reach out to the maintainers or find community links.

## Contributing

We welcome contributions from everyone! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute, report bugs, or suggest features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

*   **GitHub:** [dineshcsdev/ToxicTools](https://github.com/dineshcsdev/ToxicTools)
*   **Email:** [dinesh.csdev@gmail.com](mailto:dinesh.csdev@gmail.com)
*   **LinkedIn:** [dinesh-csdev](https://www.linkedin.com/in/dinesh-csdev)
