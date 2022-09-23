# decorate the output with colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color
# check if the script is running as root

# create a banner
echo "${YELLOW}Deploying the application${NC}"
echo "${GREEN}=========================${NC}"

# check for .env file
echo "${YELLOW}Checking for .env file${NC}"
if [ ! -f .env ]; then
    echo "${RED}Error: .env file not found! ${NC}"
    exit 1
fi
echo "${GREEN}✅ Found .env file${NC}"
echo "\n"

# check for docker-compose.prod.yaml file
echo "${YELLOW}Checking for docker-compose.prod.yaml file${NC}"
if [ ! -f docker-compose.prod.yaml ]; then
    echo "${RED}Error: docker-compose.prod.yaml file not found! ${NC}"
    exit 1
fi
echo "${GREEN}✅ Found docker-compose.prod.yaml file${NC}"
echo "\n"


# stop and remove containers
echo "${YELLOW}Stopping and removing containers${NC}"
docker-compose -f docker-compose.prod.yaml down -v
echo "${GREEN}✅ Stopped and removed containers${NC}"
echo "\n"


# build latest images and run containers
echo "${YELLOW}Building latest images and running containers${NC}"
docker-compose -f docker-compose.prod.yaml up -d --build
echo "${GREEN}✅ Built latest images and ran containers${NC}"
echo "\n"

# remove dangling images
echo "${YELLOW}Removing dangling images${NC}"
docker image prune -f
echo "${GREEN}✅ Removed dangling images${NC}"
echo "\n"

# keep making calls to https://api.call.theninza.me/api/ping until it returns 200
# for max 5 times
echo "${YELLOW}Waiting for the application to be ready${NC}"
for i in {1..5} ; do
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://api.call.theninza.me/api/ping)
    if [ $STATUS_CODE -eq 200 ]; then
        echo "${GREEN}✅ Application is ready${NC}"
        echo "\n"
        break
    fi
    echo "${YELLOW}⏳ Application is not ready yet${NC}"
    sleep 5
done

# end of script
echo "${GREEN} 🎉 Deployment completed 🎉 ${NC}"
echo "${GREEN}============================${NC}"

