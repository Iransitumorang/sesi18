# Stage: serve static files with nginx
FROM nginx:alpine

# Hapus default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy aplikasi todo-list
COPY todo-list/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
