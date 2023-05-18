# add version number 
Version=`date +'%Y-%m-%d-%H.%M.%S'`

# to resolve problem with insecure repo:
# http://stackoverflow.com/questions/38695515/can-not-pull-push-images-after-update-docker-to-1-12

y=y
docker build -t 10.0.1.65:5000/stage/skillbuilder:$Version -f Dockerfile.stage .

docker push 10.0.1.65:5000/stage/skillbuilder:$Version

#Copy .env to the App server
echo Version=$Version >> .env 

##Push Latest images to the Balancer
scp -o StrictHostKeyChecking=no .env ubuntu@10.0.2.65:/home/ubuntu/skillbuilder-app

#Remove the old Docker images from Balancer
docker rmi 10.0.1.65:5000/stage/skillbuilder:$Version

