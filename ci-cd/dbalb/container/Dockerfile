# Use an official Java runtime as a parent image
FROM openjdk:17

# Set the working directory in the container
WORKDIR /app

# Copy the compiled .jar file into the container at /app
COPY ./docsproj-0.0.1-SNAPSHOT.jar /app/docsproj-0.0.1-SNAPSHOT.jar

# Expose port 8085 for your application
EXPOSE 80

# Run the Java application
CMD ["java", "-jar", "docsproj-0.0.1-SNAPSHOT.jar"]