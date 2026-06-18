# Estágio 1: Fazer o build do projeto
FROM gradle:7.6.1-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src

# Limpa o cache fantasma e usa o limite extremo de economia de RAM e CPU
RUN rm -rf /home/gradle/.gradle/caches \
    && gradle clean build -x test --no-daemon --max-workers=1 -Dorg.gradle.jvmargs="-Xmx128m -XX:MaxMetaspaceSize=128m"

# Estágio 2: Rodar o projeto
FROM openjdk:17.0.1-jdk-slim
EXPOSE 8080
COPY build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
