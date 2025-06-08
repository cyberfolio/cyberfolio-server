# Cyberfolio Server

## Reverse proxt guide

- <https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04>

## Clone project to prod server

- eval "$(ssh-agent -s)"
- ssh-add ~/.ssh/id_ed25519_app-servers
- pm2 start dist/index.js --name cyberfolio-server -- --port 5300

## Reverse proxy to run multiple projects on one server

- vim /etc/nginx/sites-available/default
- service nginx restart

##  NOTES

### Github Actions

- You need to create ssh key with no passphrase because "appleboy/scp-action" does not support passphrase-protected keys
