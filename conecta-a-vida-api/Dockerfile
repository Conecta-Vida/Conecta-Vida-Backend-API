# Build da aplicação usando o Gradle Wrapper do próprio repositório.
FROM eclipse-temurin:17-jdk AS build

WORKDIR /workspace

COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew

COPY src ./src

RUN ./gradlew --no-daemon clean bootJar \
    && cp build/libs/conecta-a-vida-api-0.0.1-SNAPSHOT.jar /workspace/app.jar

# Imagem de execução menor: contém apenas o JRE e o artefato executável.
FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=build /workspace/app.jar ./app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
