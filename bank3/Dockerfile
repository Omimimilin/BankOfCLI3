# build the jar
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /workspace

# pom first so dependencies get cached
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B -DskipTests package

# run it on a smaller jre image
FROM eclipse-temurin:25-jre

WORKDIR /app

# don't run as root
RUN mkdir -p /app/logs && chown -R 10001:0 /app
COPY --from=build --chown=10001:0 /workspace/target/*.jar /app/app.jar
USER 10001

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
