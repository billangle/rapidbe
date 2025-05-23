package gov.uscis.rapidum;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@OpenAPIDefinition(
		servers = {
				@Server(url = "https://${APISERVER}", description = "RAPID CC User Mgmt API")
		}
)
//@SecurityScheme(name = "prosams-api", scheme = "basic", type = SecuritySchemeType.APIKEY, in = SecuritySchemeIn.HEADER)
@SecurityScheme(type = SecuritySchemeType.APIKEY, name = "Authorization", in = SecuritySchemeIn.HEADER)
@SpringBootApplication
public class DocsProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocsProjectApplication.class, args);
	}

}
