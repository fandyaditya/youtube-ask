# Use the mindsdb/mindsdb base image
FROM mindsdb/mindsdb

# install mindsdb youtube plugin
RUN pip install mindsdb[youtube]

# install mindsdb chromadb plugin
RUN pip install mindsdb[chromadb]
RUN pip install pysqlite3-binary

# need to copy overide/chromadb/__init__.py to fix a bug in the chromadb
COPY overide/chromadb/__init__.py /usr/local/lib/python3.10/site-packages/chromadb/__init__.py

# Set the entry point with the installation and MindsDB command
ENTRYPOINT ["sh", "-c", "python -m mindsdb --config=/root/mindsdb_config.json --api=http,mysql,mongodb"]
