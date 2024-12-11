from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from langchain_huggingface import HuggingFaceEndpoint
from loguru import logger
from typing import Optional
from config import model_dict
from analyze import get_tokens
import psycopg2

load_dotenv()

app = FastAPI()

huggingface_api_key = os.getenv("HUGGINGFACE_API_KEY")
model_name = os.getenv("MODEL_NAME")

db_config = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "port": os.getenv("DB_PORT")
}

sql_example = '''  
    select t.customer_id,t.first_name,t.last_name,t.email from customers t;
    select t.order_id,t.order_item_id,t.product_id,t.quantity,t.price from order_items t;
    select t.order_id,t.customer_id,t.total_amount from orders t;
    select t.product_id,t.product_name,t.price,t.stock_quantity from products t;  
'''

# LLM Configuration
llm_kwargs = {"temperature": 0.7, "max_length": 512}


def get_llm(model: Optional[str] = None) -> HuggingFaceEndpoint | None:
    if model not in model_dict:
        logger.error(f"{model} do no exist in model_dict")
        return None
    return HuggingFaceEndpoint(
        repo_id=model_dict[model],
        huggingfacehub_api_token=huggingface_api_key,
        temperature=llm_kwargs["temperature"],
        max_new_tokens=10240
    )


def get_database_metadata():
    metadata = {}
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        # 查询数据库中的所有表
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        tables = cursor.fetchall()

        for table in tables:
            table_name = table[0]
            cursor.execute(f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '{table_name}';
            """)
            columns = cursor.fetchall()
            metadata[table_name] = {col[0]: col[1] for col in columns}
    finally:
        if connection:
            cursor.close()
            connection.close()
    return metadata


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


@app.post("/ask_question")
async def ask_question(model_request: QueryRequest):
    try:
        keywords = get_tokens(model_request.question)
        metadata = get_database_metadata()
        logger.info("keywords " + str(metadata))
        logger.info("current model info is "+str(model_request.model))
        llm = get_llm(model_request.model)
        if not llm:
            return {"message": "No model change requested"}
        question_info = model_request.question
        response = llm.invoke(f"sql example: {sql_example} 具体问题如下: "+model_request.question)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error during model inference: {e}")
        raise HTTPException(status_code=500, detail="Error generating response")
