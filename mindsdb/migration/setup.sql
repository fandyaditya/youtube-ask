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

CREATE MODEL text_summarization_model
PREDICT highlights
USING
    engine = 'openai_engine',              
    prompt_template = 'provide an informative summary of the text text:{{content}} using full sentences';


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



-- create youtube_ask table, we need to spesify init data for chromadb collection can be created
CREATE TABLE chromadb.youtube_ask (
  select content, '{"data": "init data"}' as metadata, embeddings 
  from openai_embedding_model
  where content = 'init content'
)


--Create knowledge base
CREATE KNOWLEDGE_BASE youtube_ask_kb
USING
	model = openai_embedding_model,
	storage = chromadb.youtube_ask;
