FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy jar
COPY target/*.jar app.jar

# Extract layers (better caching)
RUN java -Djarmode=layertools -jar app.jar extract

# Run app
ENTRYPOINT ["java","org.springframework.boot.loader.launch.JarLauncher"]