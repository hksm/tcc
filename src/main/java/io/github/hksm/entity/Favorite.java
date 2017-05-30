package io.github.hksm.entity;

import com.querydsl.core.annotations.QueryEntity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

/**
 * @author Marcos H. Henkes
 */
@Entity
@QueryEntity
public class Favorite {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private UserData userData;

    @ManyToOne
    private Food food;

    private LocalDateTime dateTime;

    public Favorite() {
    }

    public Favorite(Long id, UserData userData, Food food, LocalDateTime dateTime) {
        this.id = id;
        this.userData = userData;
        this.food = food;
        this.dateTime = dateTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserData getUserData() {
        return userData;
    }

    public void setUserData(UserData userData) {
        this.userData = userData;
    }

    public Food getFood() {
        return food;
    }

    public void setFood(Food food) {
        this.food = food;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

}
