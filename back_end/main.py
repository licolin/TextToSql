from dotenv import load_dotenv
import os
from langchain.llms import HuggingFaceHub
from huggingface_hub import login
from loguru import logger

load_dotenv()

huggingface_api_key = os.getenv("HUGGINGFACE_API_KEY")

model_name = os.getenv("MODEL_NAME")

login(token=huggingface_api_key)

llm = HuggingFaceHub(
    repo_id=model_name,
    huggingfacehub_api_token=huggingface_api_key,
    model_kwargs={"temperature": 0.7, "max_length": 512}
)

response = llm("当前纳斯达克指数、标普500指数分别是多少")

print(response)
