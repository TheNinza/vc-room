# check for .env file
echo "Checking for .env file..."
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi
echo "Found .env file"
echo "\n"

# check for docker-compose.prod.yaml file
echo "Checking for docker-compose.prod.yaml file..."
if [ ! -f docker-compose.prod.yaml ]; then
    echo "Error: docker-compose.prod.yaml file not found"
    exit 1
fi
echo "Found docker-compose.prod.yaml file"
echo "\n"


# stop and remove containers
echo "Stopping and removing containers..."
docker-compose -f docker-compose.prod.yaml down -v
echo "\n"

# remove images
echo "Removing images..."
  # get image name from docker-compose.prod.yaml
IMAGE_NAME=$(grep image docker-compose.prod.yaml | awk '{print $2}')
  # remove image
echo "Removing image $IMAGE_NAME"
docker rmi $IMAGE_NAME
echo "\n"


# build image
echo "Building image..."
docker-compose -f docker-compose.prod.yaml build
echo "\n"

# build latest images
echo "Building latest images..."
docker-compose -f docker-compose.prod.yaml up -d --build
echo "\n"

