FROM nginx:alpine

# Install OpenSSL
RUN apk add --no-cache openssl

# Create directory for certificates
RUN mkdir -p /etc/nginx/ssl

# Copy certificate generation script
COPY generate-cert.sh /tmp/
RUN chmod +x /tmp/generate-cert.sh

# Generate self-signed certificate
RUN /tmp/generate-cert.sh

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"] 