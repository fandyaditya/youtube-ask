# Use the mindsdb/mindsdb base image
FROM mindsdb/mindsdb

# pip install google-api-python-client and youtube-transcript-api
RUN pip install google-api-python-client youtube-transcript-api

# Set the entry point with the installation and MindsDB command
ENTRYPOINT ["sh", "-c", "pip install google-api-python-client youtube-transcript-api && python -m mindsdb --config=/root/mindsdb_config.json --api=http,mysql,mongodb"]
