# Use the mindsdb/mindsdb base image
FROM mindsdb/mindsdb

# install mindsdb youtube plugin
RUN pip install mindsdb[youtube]

# install mindsdb chromadb plugin
RUN pip install mindsdb[chromadb]
# RUN pip install pysqlite3-binary

# This create folder is needed for chromadb integration can run
RUN mkdir -p /usr/local/lib/python3.10/site-packages/google/colab

# Set the user as root
USER root

# Change ownership and set permissions for /root/ms_storage
RUN chown -R root:root /root && chmod -R 775 /root

# Set the entry point with the installation and MindsDB command
ENTRYPOINT ["sh", "-c", "python -m mindsdb --config=/root/mindsdb_config.json --api=http,mysql,mongodb"]
