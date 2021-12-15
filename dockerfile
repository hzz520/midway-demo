FROM registry.cn-beijing.aliyuncs.com/hzz-harbor/fe-node:v1

COPY ./ /usr/local/node

EXPOSE 7001

CMD ["yarn", "start"]
