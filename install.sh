#! /bin/bash
if [ $# -ne 0 ]; then
	if [ $1 == '-r' ]; then
		echo "install and run new vue package"
		tar -cvf dist.tar dist/
		ssh ubuntu@129.211.212.60 "cd work; rm -rf dist.tar;"
		scp dist.tar ubuntu@129.211.212.60:/home/ubuntu/work
		ssh ubuntu@129.211.212.60 "cd work/dist; mv charging.gif ../; cd ../; rm -rf dist/; tar -xvf dist.tar; mv charging.gif dist/"
		ssh ubuntu@129.211.212.60 "bash run.sh -vue"
		rm  dist.tar
	else
		echo "unsupport cmd"
	fi
else
	echo "only copy vue-dist to work PATH"
	tar -cvf dist.tar dist/
	ssh ubuntu@129.211.212.60 "cd work; rm -rf dist.tar;"
	scp dist.tar ubuntu@129.211.212.60:/home/ubuntu/work
	rm  dist.tar
fi

