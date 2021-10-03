# Pull nginx base image
FROM kyma/docker-nginx

# Copy static assets into var/www
COPY /website-tracker/scribe/scribe-analytics.js /var/www/scribe-analytics.js
COPY /website-tracker/src/build/index.js /var/www/index.js

# Start up nginx server
CMD ["nginx"]
