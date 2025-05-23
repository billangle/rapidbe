package com.rightaresearch.thrive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/** Thrive App **/

@EnableJpaAuditing
@SpringBootApplication
public class ThriveApplication {

	public static void main(String[] args) {
		SpringApplication.run(ThriveApplication.class, args);
	}

}
