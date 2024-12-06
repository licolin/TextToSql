from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from langchain_huggingface import HuggingFaceEndpoint
from loguru import logger
from typing import Optional

load_dotenv()

app = FastAPI()

huggingface_api_key = os.getenv("HUGGINGFACE_API_KEY")
model_name = os.getenv("MODEL_NAME")

# LLM Configuration
llm_kwargs = {"temperature": 0.7, "max_length": 512}


# Function to instantiate the model dynamically
def get_llm(model: Optional[str] = None) -> HuggingFaceEndpoint:
    model_to_use = model or model_name
    return HuggingFaceEndpoint(
        repo_id=model_to_use,
        huggingfacehub_api_token=huggingface_api_key,
        temperature=llm_kwargs["temperature"],
        max_new_tokens=10240
    )


class QueryRequest(BaseModel):
    question: str
    model: Optional[str] = None  # Optionally allow specifying a new model


class ModelConfigRequest(BaseModel):
    temperature: Optional[float] = None
    max_length: Optional[int] = None


@app.post("/change_model")
async def change_model(model_request: QueryRequest, llm: HuggingFaceEndpoint = Depends(get_llm)):
    if model_request.model:
        new_model = model_request.model
        # Change model endpoint dynamically
        llm = HuggingFaceEndpoint(
            repo_id=new_model,
            huggingfacehub_api_token=huggingface_api_key,
            temperature=llm_kwargs["temperature"],
            max_new_tokens=10240
        )
        return {"message": f"Model changed to {new_model}"}
    return {"message": "No model change requested"}


@app.post("/change_model_params")
async def change_model_params(config_request: ModelConfigRequest, llm: HuggingFaceEndpoint = Depends(get_llm)):
    global llm_kwargs
    if config_request.temperature is not None:
        llm_kwargs["temperature"] = config_request.temperature
    if config_request.max_length is not None:
        llm_kwargs["max_length"] = config_request.max_length
    return {"message": "Model parameters updated"}


# Endpoint to ask questions
@app.post("/ask_question")
async def ask_question(model_request: QueryRequest, llm: HuggingFaceEndpoint = Depends(get_llm)):
    try:
        # Use the invoke method for the model query
        response = llm.invoke({"inputs": model_request.question})
        return {"response": response}
    except Exception as e:
        logger.error(f"Error during model inference: {e}")
        raise HTTPException(status_code=500, detail="Error generating response")
