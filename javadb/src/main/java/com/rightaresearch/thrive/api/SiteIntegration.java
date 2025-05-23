package com.rightaresearch.thrive.api;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Setter
public class SiteIntegration {
    private String id;
    private String host;
    private int port;
    private boolean enabled;
}
