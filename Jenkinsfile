pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build ENV') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'SHAKECODE_DB_PASS', variable: 'DB_PASS')]) {
                        sh """
                        echo "PORT=3000" >> .env
                        echo "DB_HOST=192.168.1.100" >> .env
                        echo "DB_PORT=5432" >> .env
                        echo "DB_USER=postgres" >> .env
                        echo "DB_PASS=$DB_PASS" >> .env
                        echo "DB_NAME=shakecode" >> .env
                        ./genkey.sh >> .env
                        """
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'LYJ_DockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        echo $password | docker login --username $username --password-stdin
                        docker build -f Dockerfile -t $username/shakecode_back .
                        """
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'LYJ_DockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        docker push $username/shakecode_back
                        """
                    }
                }
            }
        }

        stage('Deploy to Prod') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'LYJ_DockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        docker ps
                        docker stop shakecode_back || true
                        docker rm shakecode_back || true
                        docker pull $username/shakecode_back
                        docker run -it -d --name shakecode_back --restart always -p 9007:3000 $username/shakecode_back
                        docker network connect --ip 192.168.1.101 shakecode_default shakecode_back
                        docker image prune -f
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}