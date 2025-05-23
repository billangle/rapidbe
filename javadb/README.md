
#API Server Thrive


#SWAGGER Doc
http://localhost:8899/swagger-ui/index.html?configUrl=/v3/api-docs/swagger-config

## Getting Started
1. Make sure to install the following dependencies.

- Java 11
- Maven 3.6
- PostgresSQL 10.4


* src/main/java/com/mtb/thrive/ThriveApplication.java
* src/test/java/com/mtb/thrive/SiteTests.java

The service has a persistence layer and PostgresSQL database dependencies. 

Requires a database called thrive - defined the properties file



### Prerequisites

* Maven

### Running

    mvn install -DskipTests && java -jar target/thrive*.jar

### Testing

    run tests in SiteTests after the system is running.


### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/2.3.4.RELEASE/maven-plugin/reference/html/)

