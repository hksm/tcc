package io.github.hksm.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * @author Marcos H. Henkes
 */
@Entity
public class Notification {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private String message;

    @ManyToOne
    private UserData userData;

    private boolean dispensed;

    public Notification() {
    }

    public Notification(Long id, String message, UserData userData, boolean dispensed) {
        this.id = id;
        this.message = message;
        this.userData = userData;
        this.dispensed = dispensed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserData getUserData() {
        return userData;
    }

    public void setUserData(UserData userData) {
        this.userData = userData;
    }

    public boolean isDispensed() {
        return dispensed;
    }

    public void setDispensed(boolean dispensed) {
        this.dispensed = dispensed;
    }
}
