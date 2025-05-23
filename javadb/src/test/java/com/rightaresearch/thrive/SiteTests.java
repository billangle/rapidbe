package com.rightaresearch.thrive;

import com.rightaresearch.thrive.api.SiteDetails;
import com.rightaresearch.thrive.config.ThriveConfig;
import com.rightaresearch.thrive.model.Property;
import com.rightaresearch.thrive.repository.PropertyRepository;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//public class SiteTests  {
public class SiteTests  extends SiteBaseTest {

    @Autowired
    ThriveConfig thriveConfig;

    @Autowired
    PropertyRepository propertyRepository;

    private final Logger logger = LoggerFactory.getLogger(getClass());


    RestTemplate restTemplate = new RestTemplate();

    @Test
    @Order(1)
    public void createANewSite () throws Exception
    {
        String path = "/properties/integration/site/ckrc88qf6000p01063tarr66";
        SiteDetails request = new SiteDetails();
        request.setHost("api.some-host.com");
        request.setEnabled(true);
        request.setPort(104);
        HttpEntity<SiteDetails> httpEntity = new HttpEntity<>(request, thriveConfig.createHttpHeaders());
        ResponseEntity<String> responseEntity = post(path, httpEntity, String.class);
        String json = responseEntity.getBody();
        System.out.println(json);

        assertTrue(json.contains("ckrc88qf6000p01063tarr66"));

    }

    @Test
    @Order(2)
    public void createASecondNewSite () throws Exception
    {
        String path = "/properties/integration/site/ckrc88qf6000p01063tarr66";
        SiteDetails request = new SiteDetails();
        request.setHost("api.some-other-host.com");
        request.setEnabled(false);
        request.setPort(103);
        HttpEntity<SiteDetails> httpEntity = new HttpEntity<>(request, thriveConfig.createHttpHeaders());
        ResponseEntity<String> responseEntity = post(path, httpEntity, String.class);
        String json = responseEntity.getBody();
        System.out.println(json);
        assertTrue(json.contains("ckrc88qf6000p01063tarr66"));
    }

    @Test
    @Order(3)
    public void createAThirdNewSite () throws Exception
    {
        String path = "/properties/integration/site/ckyd9ia6k003p0121arwtn2gr";
        SiteDetails request = new SiteDetails();
        request.setHost("api.yet-another-host.com");
        request.setEnabled(true);
        request.setPort(104);
        HttpEntity<SiteDetails> httpEntity = new HttpEntity<>(request, thriveConfig.createHttpHeaders());
        ResponseEntity<String> responseEntity = post(path, httpEntity, String.class);
        String json = responseEntity.getBody();
        System.out.println(json);
        assertTrue(json.contains("ckyd9ia6k003p0121arwtn2gr"));
    }


    @Test
    @Order(4)
    public void listTheSites () throws Exception
    {
        String path = "/properties/integration/site/ckrc88qf6000p01063tarr66";
        SiteDetails request = new SiteDetails();

        HttpEntity<HttpHeaders> httpEntity = new HttpEntity<>( thriveConfig.createHttpHeaders());
        ResponseEntity<String> responseEntity = get(path, httpEntity, String.class);
        String json = responseEntity.getBody();
        System.out.println(json);
        assertTrue(json.contains("ckrc88qf6000p01063tarr66"));
    }

    @Test
    @Order(5)
    public void listTheSitesFromDB () throws Exception
    {
       List<Property> propertyList = propertyRepository.findAll();
       propertyList.forEach(p->{
           System.out.println (p);
       });
        assertTrue(propertyList.size() ==3);
    }

    @Test
    @Order(6)
    public void deleteASite () throws Exception
    {
        String path = "/properties/integration/site/ckrc88qf6000p01063tarr66/index/0";
        SiteDetails request = new SiteDetails();

        HttpEntity<HttpHeaders> httpEntity = new HttpEntity<>( thriveConfig.createHttpHeaders());
        ResponseEntity<String> responseEntity = delete(path, httpEntity, String.class);
        String json = responseEntity.getBody();
        System.out.println(json);
        assertTrue(json.contains("ckrc88qf6000p01063tarr66"));
    }

    @Test
    @Order(7)
    public void listAfterDelete () throws Exception
    {
        String path = "/properties/integration/site/ckrc88qf6000p01063tarr66";
        SiteDetails request = new SiteDetails();

        HttpEntity<HttpHeaders> httpEntity = new HttpEntity<>( thriveConfig.createHttpHeaders());
        ResponseEntity<String> responseEntity = get(path, httpEntity, String.class);
        String json = responseEntity.getBody();
        System.out.println(json);
        assertTrue(json.contains("ckrc88qf6000p01063tarr66"));
    }

    @Test
    @Order(8)
    public void deleteAnotherSite () throws Exception
    {
        String path = "/properties/integration/site/ckrc88qf6000p01063tarr66/index/1";
        SiteDetails request = new SiteDetails();

        HttpEntity<HttpHeaders> httpEntity = new HttpEntity<>( thriveConfig.createHttpHeaders());
        ResponseEntity<String> responseEntity = delete(path, httpEntity, String.class);
        String json = responseEntity.getBody();
        System.out.println(json);

        String path1 = "/properties/integration/site/ckyd9ia6k003p0121arwtn2gr/index/0";
        SiteDetails request1 = new SiteDetails();

        HttpEntity<HttpHeaders> httpEntity1 = new HttpEntity<>( thriveConfig.createHttpHeaders());
        ResponseEntity<String> responseEntity1 = delete(path1, httpEntity1, String.class);
        String json1 = responseEntity1.getBody();
        System.out.println(json1);

        List<Property> propertyList = propertyRepository.findAll();
        assertTrue(propertyList.size() ==0);

    }


    private <TRequest, TResponse> ResponseEntity<TResponse> post(
            String path,
            HttpEntity<TRequest> entity,
            Class<TResponse> responseClass
    ) throws ResponseStatusException {
        //RestTemplate restTemplate = new RestTemplate();
        try {
            URI uri = new URI(thriveConfig.getBaseUrl() + path);

            logger.info ("Thrive URL: " + uri.toASCIIString() + " : " + entity.hasBody() + " : " + entity);
            return restTemplate.postForEntity(uri, entity, responseClass);

        } catch (URISyntaxException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid URI.", e);
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(e.getStatusCode(), "Thrive POST '" + path + "' failed.", e);
        }

    }

    private <T> ResponseEntity<T> get(
            String path,
            HttpEntity<?> entity,
            Class<T> responseClass
    ) throws ResponseStatusException {
        //RestTemplate restTemplate = new RestTemplate();
        try {
            URI uri = new URI(thriveConfig.getBaseUrl() + path);

            logger.info ("Thrive URL: " + uri.toASCIIString() + " : " + entity.hasBody() + " : " + entity);

            return restTemplate.exchange(uri, HttpMethod.GET, entity, responseClass);

        } catch (URISyntaxException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid URI.", e);
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(e.getStatusCode(), "Thrive GET '" + path + "' failed.", e);
        }

    }

    private <T> ResponseEntity<T> delete(
            String path,
            HttpEntity<?> entity,
            Class<T> responseClass
    ) throws ResponseStatusException {
        //RestTemplate restTemplate = new RestTemplate();
        try {
            URI uri = new URI(thriveConfig.getBaseUrl() + path);

            logger.info ("Thrive URL: " + uri.toASCIIString() + " : " + entity.hasBody() + " : " + entity);

            return restTemplate.exchange(uri, HttpMethod.DELETE, entity, responseClass);

        } catch (URISyntaxException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid URI.", e);
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(e.getStatusCode(), "Thrive DELETE '" + path + "' failed.", e);
        }

    }



}
