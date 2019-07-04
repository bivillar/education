#!/bin/bash  

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -a -q)
printf "\nDocker Images:\n\n"
docker ps -a
sleep 10
printf "\nStarting Fabric\n\n"
./startFabric.sh
