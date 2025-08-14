import os
import base64
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI, RateLimitError

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Initialize OpenAI client for OpenRouter once
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

def get_lang_instruction(language: str) -> str:
    """Returns the specific language instruction string based on the selected language."""
    if language == "Tanglish":
        return "Tamil language words written in English letters (Tanglish, e.g., 'unga face romba super')."
    else:
        return f"{language} language"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tools')
def tools_page():
    return render_template('tools.html')

@app.route('/roaster')
def roaster_page():
    return render_template('roast.html')

@app.route('/toxic-compliment')
def toxic_compliment_page():
    return render_template('compliment_tool.html')

@app.route('/apology-generator')
def apology_generator_page():
    return render_template('apology_tool.html')

@app.route('/ai-flirt')
def ai_flirt_page():
    return render_template('flirt_tool.html')

@app.route('/contact')
def contact_page():
    return render_template('contact.html')

@app.route('/api/roast', methods=['POST'])
def api_roast():
    user_input = request.form.get('user_input')
    language = request.form.get('language')
    image_file = request.files.get('image')

    if not user_input and not image_file:
        return jsonify({"error": "Missing user input or image."}), 400
    if not language:
        return jsonify({"error": "Missing language selection."}), 400

    lang_instruction = get_lang_instruction(language)

    system_prompt = (
        f"You are a vicious, witty roaster. Your roast should be short and clever. "
        f"Do not use hate speech. Respond ONLY in {lang_instruction}."
    )

    messages = [
        {"role": "system", "content": system_prompt}
    ]

    model_to_use = "mistralai/mistral-7b-instruct"

    if image_file:
        model_to_use = "meta-llama/llama-3.2–11b-vision-instruct:free"
        try:
            # Read image as bytes
            image_bytes = image_file.read()
            # Encode to base64
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            # Create data URL
            image_data_url = f"data:{image_file.content_type};base64,{base64_image}"

            messages.append({
                "role": "user",
                "content": [
                    {"type": "text", "text": user_input if user_input else ""},
                    {"type": "image_url", "image_url": {"url": image_data_url}}
                ]
            })
        except Exception as e:
            print(f"Error processing image: {e}")
            return jsonify({"error": "Failed to process image."}), 500
    else:
        messages.append({"role": "user", "content": user_input})

    try:
        completion = client.chat.completions.create(
            model=model_to_use,
            messages=messages,
            temperature=0.7,
            max_tokens=500 # Increased max_tokens for potentially longer responses
        )
        response_content = ""
        # Robustly extract content, handling cases where choices or message might be missing
        if completion and completion.choices and completion.choices[0] and completion.choices[0].message:
            response_content = completion.choices[0].message.content
        
        if not response_content:
            # Log a warning if the AI returns empty content
            print(f"WARNING: OpenRouter API returned empty content for roast. Raw completion: {completion}")
            # Return a more specific error to the frontend
            return jsonify({"error": "AI model returned empty response. Please try again or adjust input."}), 500
        
        return jsonify({"response": response_content})
    except RateLimitError as e:
        print(f"ERROR: OpenRouter API Rate Limit Exceeded for roast: {e}")
        return jsonify({"error": "Reaching limit, please try again in a moment."}), 429
    except Exception as e:
        # Improved error logging
        print(f"ERROR: Failed to communicate with OpenRouter API for roast: {e}")
        return jsonify({"error": "Failed to communicate with the AI model for roasting."}), 500

@app.route('/api/toxic-compliment', methods=['POST'])
def api_toxic_compliment():
    data = request.get_json()
    user_input = data.get('user_input')
    language = data.get('language')

    if not user_input:
        return jsonify({"error": "Missing user input."}), 400
    if not language:
        return jsonify({"error": "Missing language selection."}), 400

    lang_instruction = get_lang_instruction(language)

    system_prompt = (
        f"You are a generator of toxic, backhanded compliments. "
        f"They should sound nice at first but have a subtle, stinging insult. "
        f"Respond ONLY in {lang_instruction}."
    )

    try:
        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0.7,
            max_tokens=500 # Increased max_tokens
        )
        response_content = ""
        if completion and completion.choices and completion.choices[0] and completion.choices[0].message:
            response_content = completion.choices[0].message.content
        
        if not response_content:
            print(f"WARNING: OpenRouter API returned empty content for toxic compliment. Raw completion: {completion}")
            return jsonify({"error": "AI model returned empty response. Please try again or adjust input."}), 500
        
        return jsonify({"response": response_content})
    except RateLimitError as e:
        print(f"ERROR: OpenRouter API Rate Limit Exceeded for toxic compliment: {e}")
        return jsonify({"error": "Reaching limit, please try again in a moment."}), 429
    except Exception as e:
        print(f"ERROR: Failed to communicate with OpenRouter API for toxic compliment: {e}")
        return jsonify({"error": "Failed to communicate with the AI model for toxic compliments."}), 500

@app.route('/api/apology', methods=['POST'])
def api_apology():
    data = request.get_json()
    user_input = data.get('user_input')
    language = data.get('language')

    if not user_input:
        return jsonify({"error": "Missing user input."}), 400
    if not language:
        return jsonify({"error": "Missing language selection."}), 400

    lang_instruction = get_lang_instruction(language)

    system_prompt = (
        f"You are an apology generator. Create a sincere, detailed, and context-aware apology like a letter generate at leat 6 lines with emothion like human bondings and add emojis realted to the subject"
        f"based on the user's input. Respond ONLY in {lang_instruction}."
    )

    try:
        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0.7,
            max_tokens=500 # Increased max_tokens
        )
        response_content = ""
        if completion and completion.choices and completion.choices[0] and completion.choices[0].message:
            response_content = completion.choices[0].message.content
        
        if not response_content:
            print(f"WARNING: OpenRouter API returned empty content for apology. Raw completion: {completion}")
            return jsonify({"error": "AI model returned empty response. Please try again or adjust input."}), 500
        
        return jsonify({"response": response_content})
    except RateLimitError as e:
        print(f"ERROR: OpenRouter API Rate Limit Exceeded for apology: {e}")
        return jsonify({"error": "Reaching limit, please try again in a moment."}), 429
    except Exception as e:
        print(f"ERROR: Failed to communicate with OpenRouter API for apology: {e}")
        return jsonify({"error": "Failed to communicate with the AI model for apologies."}), 500

@app.route('/api/ai-flirt', methods=['POST'])
def api_ai_flirt():
    data = request.get_json()
    user_input = data.get('user_input')
    language = data.get('language')

    if not user_input:
        return jsonify({"error": "Missing user input."}), 400
    if not language:
        return jsonify({"error": "Missing language selection."}), 400

    lang_instruction = get_lang_instruction(language)

    system_prompt = (
        f"You are an AI flirt. Generate one short, playful, and cheeky pickup line (1-2 sentences). "
        f"Keep it non-explicit. Respond ONLY in {lang_instruction}."
    )

    try:
        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0.7,
            max_tokens=500 # Increased max_tokens
        )
        response_content = ""
        if completion and completion.choices and completion.choices[0] and completion.choices[0].message:
            response_content = completion.choices[0].message.content
        
        if not response_content:
            print(f"WARNING: OpenRouter API returned empty content for AI flirt. Raw completion: {completion}")
            return jsonify({"error": "AI model returned empty response. Please try again or adjust input."}), 500
        
        return jsonify({"response": response_content})
    except RateLimitError as e:
        print(f"ERROR: OpenRouter API Rate Limit Exceeded for AI flirt: {e}")
        return jsonify({"error": "Reaching limit, please try again in a moment."}), 429
    except Exception as e:
        print(f"ERROR: Failed to communicate with OpenRouter API for AI flirt: {e}")
        return jsonify({"error": "Failed to communicate with the AI model for AI flirt."}), 500

if __name__ == '__main__':
    app.run(debug=True)