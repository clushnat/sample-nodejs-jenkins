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
    def IMAGE_TAG = "latest"

    stage('Checkout') {
      container('builder') {
        withCredentials([usernamePassword(credentialsId: 'Github', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
          sh '''
          git config --global user.name "jenkins"
          git config --global user.email "jenkins@clush.net"
          git config --global --add safe.directory /home/jenkins/agent/workspace/sample-nodejs-jenkins
          '''

          checkout scm

          sh '''
          pwd
          ls -al
          git rev-parse --abbrev-ref HEAD
          git rev-parse HEAD
          '''

          script {
            def branchName = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
            if (branchName == 'HEAD') {
                // detached HEAD 상태일 경우, 브랜치 이름을 찾기 위한 추가 명령어 실행
                branchName = sh(script: 'git name-rev --name-only HEAD', returnStdout: true).trim()
                // 'remotes/origin/' 접두사를 제거
                branchName = branchName.replaceFirst(/^remotes\/origin\//, '')
            }
            env.BRANCH_NAME = branchName
            echo "BRANCH_NAME: ${env.BRANCH_NAME}"
            env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
            env.IMAGE_TAG = "${env.BRANCH_NAME}-${env.GIT_COMMIT}"

            echo "IMAGE_TAG: ${env.IMAGE_TAG}"
            echo "BRANCH_NAME: ${env.BRANCH_NAME}"
            echo "GIT_COMMIT: ${env.GIT_COMMIT}"
          }
        }
      }
    }
    stage('Build Docker Image') {
      container('builder') {
        sh '''
        echo ${IMAGE_TAG}
        docker build -t seonchg/sample-nodejs-jenkins:${IMAGE_TAG} .
        '''
      }
    }
    stage('Push Docker Image') {
      container('builder') {
        withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKERHUB_TOKEN')]) {
          sh '''
          echo ${DOCKERHUB_TOKEN} | docker login --username seonchg --password-stdin
          docker push seonchg/sample-nodejs-jenkins:${IMAGE_TAG}
          '''
        }
      }
    }
    stage('Update Manifest File') {
      container('builder') {
        sh '''
        git config user.name "jenkins"
        git config user.email "jenkins@clush.net"
        yq eval '.spec.template.spec.containers[0].image = "seonchg/sample-nodejs-jenkins:${IMAGE_TAG}"' -i deployments/deployment.yml
        git add .
        git commit -m "updating newer image"
        git checkout main
        git push --set-upstream origin main
        '''
      }
    }
  }
}
