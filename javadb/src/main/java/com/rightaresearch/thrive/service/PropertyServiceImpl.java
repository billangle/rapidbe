package com.rightaresearch.thrive.service;

import com.rightaresearch.thrive.api.SiteDetails;
import com.rightaresearch.thrive.api.SiteIntegration;
import com.rightaresearch.thrive.model.Property;
import com.rightaresearch.thrive.repository.PropertyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class PropertyServiceImpl {

    private static final Logger logger = LoggerFactory.getLogger(PropertyServiceImpl.class);

@Autowired
    PropertyRepository propertyRepository;

    public SiteIntegration createAProperty (String id, SiteDetails request) {
        SiteIntegration result = new SiteIntegration();
        Property property = new Property();

        try {
            List<Property> propertyList = propertyRepository.findAllWithId(id);
            int siteIndex = propertyList.size();
            String propertyKey = id + "[" + siteIndex +"].host";
            Property createdProperty = new Property();
            createdProperty.setId(id);
            createdProperty.setKey(propertyKey);
            createdProperty.setValue(request.getHost());
            createdProperty.setEnabled(request.isEnabled());
            createdProperty.setPort(request.getPort());
            propertyRepository.save(createdProperty);
            result.setId(id);
            result.setHost(request.getHost());
            result.setPort(request.getPort());
            result.setEnabled(request.isEnabled());

        } catch (Exception e) {
            logger.error("ERROR: createAProperty error: " + request.getHost() + " : id: " + id + " : " + e);
        }

        return result;
    }

    public SiteIntegration deleteAProperty (String id, int index)
    {
        SiteIntegration result = new SiteIntegration();
        try {
            String propertyKey = id + "[" +index +"].host";
            Optional<Property> property = propertyRepository.findByKey(propertyKey);
            Property theProperty = new Property();
            if (property.isPresent()) {
                theProperty = property.get();
                result.setId(id);
                result.setHost(theProperty.getValue());
                result.setPort(theProperty.getPort());
                result.setEnabled(theProperty.isEnabled());
                propertyRepository.delete(property.get());
            }
            else
                logger.info ("Property " + propertyKey + " not found");
        } catch (Exception e) {
            logger.error("ERROR: delete property: " + id + " : "+ index + " : " +e);
        }

        return result;
    }

    public Collection<SiteIntegration> findAProperty (String id) {
        List<SiteIntegration> response = new ArrayList<>();
        try {
            List<Property> propertyList = propertyRepository.findAllWithId(id);
            propertyList.forEach(p->{
                SiteIntegration si = new SiteIntegration();
                si.setHost(p.getValue());
                si.setId(id);
                si.setEnabled(p.isEnabled());
                si.setPort(p.getPort());
                response.add(si);
            });

        } catch (Exception e) {
            logger.error("ERROR: getting site: " + id + " : " +e);
        }

        return response;
    }
}
