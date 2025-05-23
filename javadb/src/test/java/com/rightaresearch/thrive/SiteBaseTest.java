package com.rightaresearch.thrive;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

public abstract class SiteBaseTest {
    static PostgreSQLContainer<?> postgreSQLContainer;


    static {
        postgreSQLContainer = new PostgreSQLContainer<>("postgres:12.4-alpine").withPassword("inmemory").withUsername("inmemory");
        postgreSQLContainer.start();
    }

    @DynamicPropertySource
    static void postgresqlProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
    }
}
