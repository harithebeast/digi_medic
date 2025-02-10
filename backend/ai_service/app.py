from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import logging

app = Flask(__name__)
CORS(app)

# Configure logging for better debugging
logging.basicConfig(level=logging.DEBUG)

# Initialize the LLM with deepseek-r1
try:
    llm = OllamaLLM(model="llama3.1", streaming=True)  # Enable streaming
    logging.info("Ollama model 'llama' initialized successfully.")
except Exception as e:
    logging.error(f"Error initializing Ollama model: {str(e)}")
    llm = None

# Streaming response generator
def stream_prediction(symptoms):
    try:
        prompt = ChatPromptTemplate.from_template(
        "Given the symptoms: {symptoms}, provide a structured response with the following details:\n"
        "1. Possible diseases the patient might have.\n"
        "2. Recommended precautions to take.\n"
        "3. Suggested medications (if applicable).\n"
        "4. Dietary recommendations to aid recovery."
        )

        formatted_prompt = prompt.format(symptoms=symptoms)
        
        if not llm:
            yield "LLM not available"
            return
        
        # Stream the response
        for chunk in llm.stream(formatted_prompt):
            yield chunk + "\n"
    
    except Exception as e:
        logging.error(f"Error in prediction: {str(e)}")
        yield "Error generating response"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data:
            logging.error("No JSON data received")
            return jsonify({'error': 'Invalid request. Expected JSON data'}), 400

        symptoms = data.get("prompt", "").strip()

        if not symptoms:
            logging.error("Symptoms field missing or empty")
            return jsonify({'error': 'Symptoms cannot be empty'}), 400

        logging.info(f"Received symptoms: {symptoms}")

        return Response(stream_prediction(symptoms), content_type='text/plain; charset=utf-8')

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
