package io.github.hksm.entity;

import com.querydsl.core.annotations.QueryEntity;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
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

    @ElementCollection
    @CollectionTable(name = "SubstanceNames")
    @NotEmpty
    private Set<String> names;

    @ManyToMany(fetch = FetchType.LAZY)
    private Set<Food> containedInFood;

    public Substance() {
    }

    public Substance(Long id, Set<String> names, Set<Food> containedInFood) {
        this.id = id;
        this.names = names;
        this.containedInFood = containedInFood;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<String> getNames() {
        return names;
    }

    public void setNames(Set<String> names) {
        this.names = names;
    }

    public Set<Food> getContainedInFood() {
        return containedInFood;
    }

    public void setContainedInFood(Set<Food> containedInFood) {
        this.containedInFood = containedInFood;
    }

    public static Substance.Builder builder() {
        return new Substance.Builder();
    }

    public static class Builder {
        private Long id;
        private Set<String> names;
        private Set<Food> containedOnFood;

        private Builder() {
        }

        private Substance build() {
            return new Substance(id, names, containedOnFood);
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(Set<String> names) {
            this.names = names;
            return this;
        }

        public Builder containedOnFood(Set<Food> containedOnFood) {
            this.containedOnFood = containedOnFood;
            return this;
        }
    }
}