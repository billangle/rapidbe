package com.rightaresearch.thrive.controller.impl;

import com.rightaresearch.thrive.api.SiteDetails;
import com.rightaresearch.thrive.api.SiteIntegration;
import com.rightaresearch.thrive.controller.Integration;
import com.rightaresearch.thrive.service.PropertyServiceImpl;
import com.rightaresearch.thrive.service.util.ResponseUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collection;

@RestController
public class IntegrationImpl implements Integration {

    @Autowired
    PropertyServiceImpl propertyService;

    @Override
    public ResponseEntity<SiteIntegration> importNewSite(String id, @Valid SiteDetails newSiteDetails) throws Exception {

        SiteIntegration response = new SiteIntegration();
        response = propertyService.createAProperty(id,newSiteDetails);
        return ResponseUtility.buildOkResponse(response);
    }

    @Override
    public ResponseEntity<SiteIntegration> deleteSite(String id, int index) throws Exception {
        SiteIntegration response = new SiteIntegration();
        response = propertyService.deleteAProperty(id,index);
        return ResponseUtility.buildOkResponse(response);
    }

    @Override
    public ResponseEntity<Collection<SiteIntegration>> getSite(String id) throws Exception {
        Collection<SiteIntegration> response = new ArrayList<>();

        response = propertyService.findAProperty(id);
        return ResponseUtility.buildOkResponse(response);
    }
}
