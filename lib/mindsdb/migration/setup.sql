--Run in sequence

--Setup ml engine
CREATE ML_ENGINE embedding FROM langchain_embedding;

CREATE ML_ENGINE openai_engine
FROM openai
USING
	api_key = 'sk-xxxx'; -- your openai api key


--Create embedding model
CREATE MODEL openai_embedding_model
PREDICT embeddings
USING
	engine = "embedding",
	class = "openai",
	api_key = "sk-xxxx", -- your openai api key
	input_columns = ["content"];

CREATE MODEL q_n_a_model
PREDICT answer
USING
	engine = 'openai_engine',
	prompt_template = 'Use the following pieces of video context to answer the question at the end. If you do not know the answer, just say that you do not know, do not try to make up an answer. Dont answer outside of the context given.
                        Video context: {{context}}
                        Question: {{question}}
                        Helpful Answer:',
	model_name= 'gpt-3.5-turbo-16k',
	mode = 'default',
	max_tokens = 1500;



-- Connect to Chroma
CREATE DATABASE chromadb
WITH ENGINE = "chromadb",
PARAMETERS = {
	"persist_directory": "chromadb/"
};

-- Connect to Youtube API
CREATE DATABASE youtubedb
WITH ENGINE = 'youtube',
PARAMETERS = {
  "youtube_api_token": "AIzxxx" --  your youtube api token
};



-- create youtube_ask table, we need to spesify init dummy data so chromadb collection can be created
CREATE TABLE chromadb.youtube_ask (
  select content, '{"data": "init data"}' as metadata, embeddings 
  from openai_embedding_model
  where content = 'init content'
);


--Create knowledge base
CREATE KNOWLEDGE_BASE youtube_ask_kb
USING
	model = openai_embedding_model,
	storage = chromadb.youtube_ask;


