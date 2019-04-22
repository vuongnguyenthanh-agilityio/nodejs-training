echo "## Start dynamodb local"

cd dynamo-local/dynamodb_local_latest
pwd
chmod +x DynamoDBLocal.jar
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
cd ..
cd ..