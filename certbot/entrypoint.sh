#!/bin/sh

# 최초 실행 시 인증서가 없으면 발급
if [ ! -f /etc/letsencrypt/live/api.hy3ons.site/fullchain.pem ]; then
  certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email $CERTBOT_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $CERTBOT_DOMAIN
fi

# 무한 루프로 컨테이너 유지 (또는 crond로 갱신 작업 등 가능)
trap exit TERM
while :; do sleep 12h & wait $!; done