const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const yaml = require('js-yaml');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Template API',
      version: '1.0.0',
    },
  },
  apis: ['./src/api/*.js'], // API 파일 경로 패턴
};

const openapiSpecification = swaggerJSDoc(options);

console.log(openapiSpecification);

// JSON 대신 YAML 형식으로 파일 저장
fs.writeFile('./openapi.yaml', yaml.dump(openapiSpecification), (err) => {
  if (err) throw err;
  console.log('The OpenAPI specification has been successfully generated in openapi-spec.yaml.');
});