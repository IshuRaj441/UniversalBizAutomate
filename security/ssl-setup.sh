#!/bin/bash

# SSL Setup Script for Universal Business Automation
# This script sets up SSL certificates using Let's Encrypt

set -e

DOMAIN="yourdomain.com"
EMAIL="admin@yourdomain.com"
NGINX_DIR="/etc/nginx"
SSL_DIR="/etc/nginx/ssl"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔒 Setting up SSL for Universal Business Automation${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (sudo)${NC}"
    exit 1
fi

# Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${YELLOW}📦 Installing required packages...${NC}"
apt install -y nginx certbot python3-certbot-nginx

# Create SSL directory
echo -e "${YELLOW}📁 Creating SSL directory...${NC}"
mkdir -p $SSL_DIR

# Generate strong DH parameters
echo -e "${YELLOW}🔐 Generating DH parameters (this may take a while)...${NC}"
openssl dhparam -out $SSL_DIR/dhparam.pem 2048

# Create temporary nginx config for Let's Encrypt validation
echo -e "${YELLOW}⚙️ Creating temporary nginx configuration...${NC}"
cat > /etc/nginx/sites-available/uba-temp << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN api.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF

# Enable temporary site
ln -sf /etc/nginx/sites-available/uba-temp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart nginx
nginx -t && systemctl restart nginx

# Obtain SSL certificate
echo -e "${YELLOW}🔑 Obtaining SSL certificate from Let's Encrypt...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN -d api.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

# Create strong SSL configuration
echo -e "${YELLOW}🛡️ Creating strong SSL configuration...${NC}"
cat > $SSL_DIR/ssl-params.conf << EOF
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_ecdh_curve secp384r1;
ssl_session_timeout 10m;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
EOF

# Set up auto-renewal
echo -e "${YELLOW}🔄 Setting up auto-renewal...${NC}"
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

# Test SSL configuration
echo -e "${YELLOW}🧪 Testing SSL configuration...${NC}"
nginx -t

# Restart nginx
echo -e "${YELLOW}🔄 Restarting nginx...${NC}"
systemctl restart nginx

# Display certificate information
echo -e "${GREEN}✅ SSL setup completed successfully!${NC}"
echo -e "${GREEN}📋 Certificate information:${NC}"
certbot certificates

echo -e "${GREEN}🌐 Your sites are now accessible with HTTPS:${NC}"
echo -e "   • https://$DOMAIN"
echo -e "   • https://www.$DOMAIN"
echo -e "   • https://api.$DOMAIN"

echo -e "${GREEN}📝 Next steps:${NC}"
echo -e "   1. Update your application to use HTTPS URLs"
echo -e "   2. Configure your domain DNS to point to this server"
echo -e "   3. Test your application with HTTPS"

# Test SSL rating
echo -e "${YELLOW}🧪 Testing SSL configuration quality...${NC}"
sleep 5
curl -s https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN&hideResults=on

echo -e "${GREEN}🎉 SSL setup complete!${NC}"
