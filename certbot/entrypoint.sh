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