from dotenv import load_dotenv
import os
from langchain.llms import HuggingFaceHub

load_dotenv()

huggingface_api_key = os.getenv("HUGGINGFACE_API_KEY")

print("huggingface_api_key ", huggingface_api_key)
model_name = os.getenv("MODEL_NAME")

from huggingface_hub import login

login(token=huggingface_api_key)

llm = HuggingFaceHub(
    repo_id=model_name,
    huggingfacehub_api_token=huggingface_api_key,
    model_kwargs={"temperature": 0.7, "max_length": 512}
)

# llm = HuggingFaceHub(
#     repo_id=model_name,
#     model_kwargs={
#         "temperature": 0.7,
#         "max_length": 512
#     }
# )

response = llm("What is the capital of France?")
print(response)
