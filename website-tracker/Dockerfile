# Pull nginx base image
FROM kyma/docker-nginx

# Copy static assets into var/www
COPY /website-tracker/scribe-analytics.js /var/www/scribe-analytics.js

# Start up nginx server
CMD ["nginx"]
