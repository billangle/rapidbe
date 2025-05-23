package com.rightaresearch.thrive.api;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Setter
public class SiteDetails {
    private String host;
    private int port;
    private boolean enabled;
}
