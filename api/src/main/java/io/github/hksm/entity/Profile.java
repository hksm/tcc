package io.github.hksm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.common.collect.ImmutableMap;
import com.querydsl.core.annotations.QueryEntity;
import com.querydsl.core.types.Path;
import io.github.hksm.constant.Category;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Map;
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

    @NotNull
    private Long userId;

    @NotNull
    private String fullName;

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

    public Profile(Long id, Long userId, String fullName, Set<Food> food, Set<Substance> substance) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.food = food;
        this.substance = substance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private Long id;
        private Long userId;
        private String fullName;
        private Set<Food> food;
        private Set<Substance> substance;

        private Builder() {
        }

        public Profile build() {
            return new Profile(id, userId, fullName, food, substance);
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder userId(Long userId) {
            this.userId = userId;
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
