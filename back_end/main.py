from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from langchain.llms import HuggingFaceHub
from huggingface_hub import login
from loguru import logger
from typing import Optional

load_dotenv()

app = FastAPI()

huggingface_api_key = os.getenv("HUGGINGFACE_API_KEY")
model_name = os.getenv("MODEL_NAME")

login(token=huggingface_api_key)

llm_kwargs = {"temperature": 0.7, "max_length": 512}

llm = HuggingFaceHub(
    repo_id=model_name,
    huggingfacehub_api_token=huggingface_api_key,
    model_kwargs=llm_kwargs
)


class QueryRequest(BaseModel):
    question: str
    model: Optional[str] = None  # Optionally allow specifying a new model


class ModelConfigRequest(BaseModel):
    temperature: Optional[float] = None
    max_length: Optional[int] = None


@app.post("/change_model")
async def change_model(model_request: QueryRequest):
    global llm
    if model_request.model:
        new_model = model_request.model
        llm = HuggingFaceHub(
            repo_id=new_model,
            huggingfacehub_api_token=huggingface_api_key,
            model_kwargs=llm_kwargs
        )
        return {"message": f"Model changed to {new_model}"}
    return {"message": "No model change requested"}


@app.post("/change_model_params")
async def change_model_params(config_request: ModelConfigRequest):
    global llm_kwargs
    if config_request.temperature is not None:
        llm_kwargs["temperature"] = config_request.temperature
    if config_request.max_length is not None:
        llm_kwargs["max_length"] = config_request.max_length

    # Update the model with the new params
    global llm
    llm = HuggingFaceHub(
        repo_id=model_name,
        huggingfacehub_api_token=huggingface_api_key,
        model_kwargs=llm_kwargs
    )


# Endpoint to ask questions
@app.post("/ask_question")
async def ask_question(model_request: QueryRequest):
    try:
        global llm
        llm = HuggingFaceHub(
            repo_id=model_name,
            huggingfacehub_api_token=huggingface_api_key,
            model_kwargs=llm_kwargs
        )

        response = llm(model_request.question)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error during model inference: {e}")
        raise HTTPException(status_code=500, detail="Error generating response")


# uvicorn your_script_name:app --reload
