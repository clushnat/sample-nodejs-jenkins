// pipeline {
//     agent any
//     environment {
//         DOCKERHUB_TOKEN = credentials('dockerhub-token')
//         IMAGE_TAG = "${env.BRANCH_NAME}-${env.GIT_COMMIT}"
//     }
//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scm
//             }
//         }
//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     sh '''
//                     docker buildx create --use
//                     docker buildx inspect default --bootstrap
//                     docker buildx build --file Dockerfile -t seonchg/sample-nodejs-demo:$IMAGE_TAG --load .
//                     '''
//                 }
//             }
//         }
//         stage('Push Docker Image') {
//             steps {
//                 script {
//                     sh '''
//                     echo $DOCKERHUB_TOKEN | docker login --username seonchg --password-stdin
//                     docker push seonchg/sample-nodejs-demo:$IMAGE_TAG
//                     '''
//                 }
//             }
//         }
//         stage('Update Manifest File') {
//             steps {
//                 script {
//                     sh '''
//                     git config user.name "jenkins"
//                     git config user.email "jenkins@clush.net"
//                     yq eval '.spec.template.spec.containers[0].image = "seonchg/sample-nodejs-demo:${IMAGE_TAG}"' -i deployments/deployment.yml
//                     git add .
//                     git commit -m "updating newer image"
//                     git push --set-upstream origin master
//                     '''
//                 }
//             }
//         }
//     }
// }

def IMAGE_TAG

podTemplate(label: 'jenkins-slave-pod',
  containers: [
    containerTemplate(
      name: 'builder',
      image: 'seonchg/clushnat-builder:latest',
      command: 'cat',
      ttyEnabled: true
    ),
  ],
  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
  ]
) {
  node('jenkins-slave-pod') {
    stage('Checkout') {
      container('builder') {
        withCredentials([usernamePassword(credentialsId: 'Github', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
          sh '''
          git config --global user.name "jenkins"
          git config --global user.email "jenkins@clush.net"
          '''

          checkout scm
          script {
            env.BRANCH_NAME = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
            env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
            IMAGE_TAG = "${env.BRANCH_NAME}-${env.GIT_COMMIT}"
          }
        }
      }
    }
    stage('Build Docker Image') {
      container('builder') {
        sh '''
        echo $IMAGE_TAG
        docker build -t seonchg/sample-nodejs-jenkins:$IMAGE_TAG .
        '''
      }
    }
    stage('Push Docker Image') {
      container('builder') {
        withCredentials([secretText(credentialsId: 'dockerhub-token', variable: 'DOCKERHUB_TOKEN')]) {
          sh '''
          echo $DOCKERHUB_TOKEN | docker login --username seonchg --password-stdin
          docker push seonchg/sample-nodejs-jenkins:$IMAGE_TAG
          '''
        }

      }
    }
//     stage('Update Manifest File') {
//       container('git') {
//         sh '''
//         git config user.name "jenkins"
//         git config user.email "jenkins@clush.net"
//         yq eval '.spec.template.spec.containers[0].image = "seonchg/sample-nodejs-demo:${IMAGE_TAG}"' -i deployments/deployment.yml
//         git add .
//         git commit -m "updating newer image"
//         git push --set-upstream origin master
//         '''
//         }
//     }
  }
}
