# 빌드 스테이지
FROM node:20 AS builder

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 실제 실행을 위한 스테이지
FROM node:20-alpine

WORKDIR /app

# 빌드 스테이지에서 빌드된 파일 복사
COPY --from=builder /app ./

# clushnat 사용자 생성 및 사용자 변경
RUN addgroup -S clushnat && adduser -S clushnat -G clushnat
USER clushnat

# 애플리케이션 포트 노출
EXPOSE 8000

# 애플리케이션 실행 명령
CMD [ "node", "index.js" ]
