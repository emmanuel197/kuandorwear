// CI pipeline for Kuandorwear (Django + DRF e-commerce backend).
// Declarative pipeline: checkout -> build image -> lint -> test+coverage -> archive image.
// Lint and tests run INSIDE the freshly built image, so CI exercises the
// exact artifact we would ship.
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        IMAGE = 'kuandorwear'
        // Settings has no SECRET_KEY default; tests need one. Never a real key.
        SECRET_KEY = 'jenkins-ci-only-not-a-real-secret'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Building commit ${env.GIT_COMMIT ?: 'local'}"
            }
        }

        stage('Build image') {
            steps {
                // Build the same image we'd ship. ${BUILD_NUMBER} tags each run.
                sh 'docker build -t $IMAGE:${BUILD_NUMBER} -t $IMAGE:latest .'
            }
        }

        stage('Lint') {
            steps {
                // Gate on real errors only: syntax errors and undefined names.
                sh '''docker run --rm $IMAGE:${BUILD_NUMBER} \
                        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics'''
                // Full style report, informational (never fails the build).
                sh '''docker run --rm $IMAGE:${BUILD_NUMBER} \
                        flake8 . --count --exit-zero --statistics'''
            }
        }

        stage('Test') {
            steps {
                // This project's settings overwrite DATABASES with
                // dj_database_url.config(default=DATABASE_URL); an unset URL yields
                // a dummy backend, so we MUST hand it an explicit in-memory SQLite
                // URL. Never the real DATABASE_URL (the image has no .env anyway).
                sh '''docker run --rm \
                        -e SECRET_KEY=$SECRET_KEY \
                        -e DATABASE_URL=sqlite://:memory: \
                        $IMAGE:${BUILD_NUMBER} \
                        sh -c "coverage run --source=accounts,api,store manage.py test --verbosity=2 && coverage report"'''
            }
        }

        stage('Build artifact') {
            steps {
                // The artifact IS the tested image, saved as a portable tarball.
                sh 'docker save $IMAGE:${BUILD_NUMBER} | gzip > kuandorwear-${BUILD_NUMBER}.tar.gz'
                archiveArtifacts artifacts: 'kuandorwear-*.tar.gz'
            }
        }
    }

    post {
        success { echo 'Pipeline green: image built, lint clean, tests passed, image archived.' }
        failure { echo 'Pipeline failed: check the first red stage above.' }
    }
}
