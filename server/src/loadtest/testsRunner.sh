now=$(date +"%T")
echo "Current time : $now"
k6 run script.js
# k6 run script.js --http-debug="full" -i 1 -u 1
# k6 run script.js -i 1 -u 1

# k6 run script1.js
# k6 run script2.js
# k6 run script3.js