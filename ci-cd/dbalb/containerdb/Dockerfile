# Use an official Java runtime as a parent image
FROM openjdk:17


# Set the working directory in the container
WORKDIR /app

# Copy the compiled .jar file into the container at /app
COPY ./thrive-v15.0.0.jar /app/thrive-v15.0.0.jar

EXPOSE 80

# Run the Java application
CMD ["java", "-jar", "thrive-v15.0.0.jar"]