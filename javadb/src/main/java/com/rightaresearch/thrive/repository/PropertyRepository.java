package com.rightaresearch.thrive.repository;

import com.rightaresearch.thrive.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PropertyRepository  extends JpaRepository<Property, String> {
     Optional<Property> findByKey (String key);

     @Query("SELECT p from Property p where "
            + " p.id= :id ")
     List<Property> findAllWithId (@Param("id") String id);

}
