docker build -t juanmiguel431/multi-client:latest -t juanmiguel431/multi-client:$GIT_SHA ./client
docker build -t juanmiguel431/multi-server:latest -t juanmiguel431/multi-server:$GIT_SHA ./server
docker build -t juanmiguel431/multi-worker:latest -t juanmiguel431/multi-worker:$GIT_SHA ./worker

docker push juanmiguel431/multi-client:latest
docker push juanmiguel431/multi-server:latest
docker push juanmiguel431/multi-worker:latest

docker push juanmiguel431/multi-client:$GIT_SHA
docker push juanmiguel431/multi-server:$GIT_SHA
docker push juanmiguel431/multi-worker:$GIT_SHA

kubectl apply -f k8s

kubectl set image deployments/client-deployment client=juanmiguel431/multi-client:$GIT_SHA
kubectl set image deployments/server-deployment server=juanmiguel431/multi-server:$GIT_SHA
kubectl set image deployments/worker-deployment worker=juanmiguel431/multi-worker:$GIT_SHA

