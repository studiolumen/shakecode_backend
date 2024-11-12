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
                        echo "DB_HOST=localhost" >> .env
                        echo "DB_PORT=9101" >> .env
                        echo "DB_PASS=$DB_PASS" >> .env
                        echo "DB_NAME=shakecode" >> .env
                        ./genkey.sh >> .env
                        """
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'LYJ_DockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        echo $password | docker login --username $username --password-stdin
                        docker build -f Dockerfile -t $username/shakecode_back .
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
                        docker run -d --name shakecode_back --restart always --network shakecode --ip 172.20.0.101 --add-host host.docker.internal:host-gateway -p 9007:3000 $username/shakecode_back
                        docker network connect lyj_default shakecode_back
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