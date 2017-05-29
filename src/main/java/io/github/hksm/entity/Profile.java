package io.github.hksm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.querydsl.core.annotations.QueryEntity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Set;

/**
 * @author Marcos H. Henkes
 */
@Entity
@QueryEntity
public class Profile {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    private UserData userData;

    @NotNull
    private String fullName;

    private long imageId;

    @JsonIgnoreProperties(value = {"relatedFood", "containedSubstances", "tags"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "profile_food",
            joinColumns = @JoinColumn(name = "profile_food_profile"),
            inverseJoinColumns = @JoinColumn(name = "profile_food_food"),
            foreignKey = @ForeignKey(name = "fk_profile_food_profile"),
            inverseForeignKey = @ForeignKey(name = "fk_profile_food_food"))
    private Set<Food> food;

    @JsonIgnoreProperties(value = {"containedInFood"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "profile_substance",
            joinColumns = @JoinColumn(name = "profile_substance_profile"),
            inverseJoinColumns = @JoinColumn(name = "profile_substance_substance"),
            foreignKey = @ForeignKey(name = "fk_profile_substance_profile"),
            inverseForeignKey = @ForeignKey(name = "fk_profile_substance_substance"))
    private Set<Substance> substance;

    public Profile() {
    }

    public Profile(Long id, UserData userData, String fullName, long imageId, Set<Food> food, Set<Substance> substance) {
        this.id = id;
        this.userData = userData;
        this.fullName = fullName;
        this.imageId = imageId;
        this.food = food;
        this.substance = substance;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Set<Food> getFood() {
        return food;
    }

    public void setFood(Set<Food> food) {
        this.food = food;
    }

    public Set<Substance> getSubstance() {
        return substance;
    }

    public void setSubstance(Set<Substance> substance) {
        this.substance = substance;
    }

    public long getImageId() {
        return imageId;
    }

    public void setImageId(long imageId) {
        this.imageId = imageId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private Long id;
        private UserData userData;
        private String fullName;
        private Set<Food> food;
        private Set<Substance> substance;
        private long imageId;

        private Builder() {
        }

        public Profile build() {
            return new Profile(id, userData, fullName, imageId, food, substance);
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder imageId(Long imageId) {
            this.imageId = imageId;
            return this;
        }

        public Builder userData(UserData userData) {
            this.userData = userData;
            return this;
        }

        public Builder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder food(Set<Food> food) {
            this.food = food;
            return this;
        }

        public Builder substance(Set<Substance> substance) {
            this.substance = substance;
            return this;
        }
    }

}
