# 设置基础镜像
FROM hub.c.163.com/library/nginx:latest

# 将dist文件中的内容复制到 /usr/vuejs/nginx/这个目录下面
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/  /usr/vuejs/nginx/ 