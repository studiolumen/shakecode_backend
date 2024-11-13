FROM public.ecr.aws/docker/library/node:lts-alpine

RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

WORKDIR /app

COPY . .

RUN yarn install


RUN yarn build

CMD [ "yarn", "start:prod" ]
