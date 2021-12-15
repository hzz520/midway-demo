FROM registry.cn-beijing.aliyuncs.com/hzz-harbor/fe-node:v1
USER root
# RUN yum update -y
# RUN curl --silent --location https://rpm.nodesource.com/setup_12.x | bash - && yum install -y nodejs
# RUN yum install -y lsof && yum install -y vim
COPY ./ /usr/local/node

EXPOSE 7001

CMD ["/bin/sh", "npm run start"]
