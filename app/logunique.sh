cat /var/log/nginx/access.log | awk  '{print $1}' | sort -r | uniq -c | sort -nr &> $1
