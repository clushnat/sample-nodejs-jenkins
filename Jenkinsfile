pipeline {
    agent any
    environment {
        DOCKERHUB_TOKEN = credentials('dockerhub-token')
        IMAGE_TAG = "${env.BRANCH_NAME}-${env.GIT_COMMIT}"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                    docker buildx create --use
                    docker buildx inspect default --bootstrap
                    docker buildx build --file Dockerfile -t seonchg/sample-nodejs-demo:$IMAGE_TAG --load .
                    '''
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    sh '''
                    echo $DOCKERHUB_TOKEN | docker login --username seonchg --password-stdin
                    docker push seonchg/sample-nodejs-demo:$IMAGE_TAG
                    '''
                }
            }
        }
        stage('Update Manifest File') {
            steps {
                script {
                    sh '''
                    git config user.name "jenkins"
                    git config user.email "jenkins@clush.net"
                    yq eval '.spec.template.spec.containers[0].image = "seonchg/sample-nodejs-demo:${IMAGE_TAG}"' -i deployments/deployment.yml
                    git add .
                    git commit -m "updating newer image"
                    git push --set-upstream origin master
                    '''
                }
            }
        }
    }
}
