package com.rightaresearch.thrive.service.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.URI;

public class ResponseUtility {
    public static <T> ResponseEntity<T> buildOkResponse(T entity) {

        return ResponseEntity.ok().body(entity);
    }

    public static ResponseEntity<Void> buildOkResponse() {

        return ResponseEntity.ok().build();
    }

    public static ResponseEntity<URI> buildCreatedResponse(URI location) {

        return ResponseEntity.created(location).build();
    }

    public static <T> ResponseEntity<T> buildStatusResponse(HttpStatus status, T entity) {

        return ResponseEntity.status(status).body(entity);
    }

    public static ResponseEntity<URI> buildFoundResponse(URI redirectUri) {

        return ResponseEntity.status(HttpStatus.FOUND).location(redirectUri).build();
    }
}
