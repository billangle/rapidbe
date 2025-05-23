package com.rightaresearch.thrive.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@Table(
        name = "Property"
)
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Property {
    private String id;

    @Id
    private String key;
    private String value;
    private int port;
    private boolean enabled;

    public String toString() {
        StringBuffer buf = new StringBuffer();
        buf.append("id: " + id + "\n");
        buf.append("key: " + key + "\n");
        buf.append("\tvalue: " + value + "\n");
        buf.append("\tport: " + port + "\n");
        buf.append("\tenabled: " + enabled + "\n");

        return buf.toString();
    }
}
