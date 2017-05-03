package io.github.hksm.entity;

import com.google.common.collect.ImmutableMap;
import com.querydsl.core.annotations.QueryEntity;
import com.querydsl.core.types.Path;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Map;
import java.util.Set;

/**
 * @author Marcos H. Henkes
 */
@Entity
@QueryEntity
public class Substance {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private String name;

    @ManyToMany(mappedBy = "containedSubstances", fetch = FetchType.LAZY)
    private Set<Food> containedInFood;

    private boolean isAlergenic;

    public Substance() {
    }

    public Substance(Long id, String name, Set<Food> containedInFood, boolean isAlergenic) {
        this.id = id;
        this.name = name;
        this.containedInFood = containedInFood;
        this.isAlergenic = isAlergenic;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Food> getContainedInFood() {
        return containedInFood;
    }

    public void setContainedInFood(Set<Food> containedInFood) {
        this.containedInFood = containedInFood;
    }

    public boolean isAlergenic() {
        return isAlergenic;
    }

    public void setAlergenic(boolean alergenic) {
        isAlergenic = alergenic;
    }

    public static Substance.Builder builder() {
        return new Substance.Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private Set<Food> containedOnFood;
        private boolean isAlergenic;

        private Builder() {
        }

        private Substance build() {
            return new Substance(id, name, containedOnFood, isAlergenic);
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder containedOnFood(Set<Food> containedOnFood) {
            this.containedOnFood = containedOnFood;
            return this;
        }

        public Builder isAlergenic(boolean isAlergenic) {
            this.isAlergenic = isAlergenic;
            return this;
        }
    }

    public static Map<String, Path> getExpressions() {
        return ImmutableMap.<String, Path>builder()
                .put("name", QSubstance.substance.name)
                .put("containedInFood.name", QSubstance.substance.containedInFood.any().name)
                .put("alergenic", QSubstance.substance)
                .build();

    }
}