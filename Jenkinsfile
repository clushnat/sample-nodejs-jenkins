pipeline {
    agent any
    environment {
        DOCKERHUB_TOKEN = credentials('dockerhub-token')
        GITHUB_BRANCH = "${env.BRANCH_NAME}-${env.GIT_COMMIT}"
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
                    docker buildx build --file Dockerfile -t seonchg/sample-nodejs-demo:$GITHUB_BRANCH --load .
                    '''
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    sh '''
                    echo $DOCKERHUB_TOKEN | docker login --username seonchg --password-stdin
                    docker push seonchg/sample-nodejs-demo:$GITHUB_BRANCH
                    '''
                }
            }
        }
        stage('Update Manifest File') {
            steps {
                script {
                    sh '''
                    git config user.name "$GITHUB_ACTOR"
                    git config user.email "$GITHUB_ACTOR@gmail.com"
                    yq eval '.spec.template.spec.containers[0].image = "seonchg/sample-nodejs-demo:$GITHUB_BRANCH"' -i deployments/deployment.yml
                    git add .
                    git commit -m "updating newer image"
                    git push --set-upstream origin master
                    '''
                }
            }
        }
    }
}