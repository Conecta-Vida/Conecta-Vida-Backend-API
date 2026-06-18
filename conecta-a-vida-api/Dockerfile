# Estágio 1: Fazer o build do projeto
FROM gradle:7.6.1-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build -x test --no-daemon -Dorg.gradle.jvmargs="-Xmx256m"

# Estágio 2: Rodar o projeto
FROM openjdk:17.0.1-jdk-slim
EXPOSE 8080
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
