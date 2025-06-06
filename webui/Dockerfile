FROM maven:3.9.7-eclipse-temurin-17 AS build
WORKDIR /build
COPY . .
RUN mvn -q -pl webui -am package

FROM eclipse-temurin:17-jre
COPY --from=build /build/webui/target/mentor-webui-0.0.1-SNAPSHOT.jar /app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
