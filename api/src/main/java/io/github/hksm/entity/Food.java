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
public class Food {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private String name;

    @ElementCollection
    @CollectionTable(name = "FoodOtherNames")
    private Set<String> otherNames;

    private boolean isAlergenic;

    private Category category;

    @ElementCollection
    @CollectionTable(name = "FoodTags")
    private Set<String> tags;

    private BigDecimal calories;

    private BigDecimal carbs;

    private BigDecimal proteins;

    private BigDecimal lipids;

    @JsonIgnoreProperties(value = {"relatedFood", "containedSubstances", "tags"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    private Set<Food> relatedFood;

    @JsonIgnoreProperties(value = {"containedInFood"}, allowSetters = true)
    @ManyToMany(fetch = FetchType.LAZY)
    private Set<Substance> containedSubstances;

    public Food() {
    }

    private Food(Long id, String name, Set<String> otherNames, boolean isAlergenic, Category category, Set<String> tags,
                 BigDecimal calories, BigDecimal carbs, BigDecimal proteins, BigDecimal lipids, Set<Food> relatedFood,
                 Set<Substance> containedSubstances) {
        this.id = id;
        this.name = name;
        this.otherNames = otherNames;
        this.isAlergenic = isAlergenic;
        this.category = category;
        this.tags = tags;
        this.calories = calories;
        this.carbs = carbs;
        this.proteins = proteins;
        this.lipids = lipids;
        this.relatedFood = relatedFood;
        this.containedSubstances = containedSubstances;
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

    public Set<String> getOtherNames() {
        return otherNames;
    }

    public void setOtherNames(Set<String> otherNames) {
        this.otherNames = otherNames;
    }

    public boolean getAlergenic() {
        return isAlergenic;
    }

    public void setAlergenic(boolean alergenic) {
        isAlergenic = alergenic;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    public BigDecimal getCalories() {
        return calories;
    }

    public void setCalories(BigDecimal calories) {
        this.calories = calories;
    }

    public BigDecimal getCarbs() {
        return carbs;
    }

    public void setCarbs(BigDecimal carbs) {
        this.carbs = carbs;
    }

    public BigDecimal getProteins() {
        return proteins;
    }

    public void setProteins(BigDecimal proteins) {
        this.proteins = proteins;
    }

    public BigDecimal getLipids() {
        return lipids;
    }

    public void setLipids(BigDecimal lipids) {
        this.lipids = lipids;
    }

    public Set<Food> getRelatedFood() {
        return relatedFood;
    }

    public void setRelatedFood(Set<Food> relatedFood) {
        this.relatedFood = relatedFood;
    }

    public Set<Substance> getContainedSubstances() {
        return containedSubstances;
    }

    public void setContainedSubstances(Set<Substance> containedSubstances) {
        this.containedSubstances = containedSubstances;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private Set<String> otherNames;
        private boolean isAlergenic;
        private Category category;
        private Set<String> tags;
        private BigDecimal calories;
        private BigDecimal carbs;
        private BigDecimal proteins;
        private BigDecimal lipids;
        private Set<Food> relatedFood;
        private Set<Substance> containedSubstances;

        private Builder() {
        }

        public Food build() {
            return new Food(id, name, otherNames, isAlergenic, category, tags, calories, carbs, proteins, lipids,
                    relatedFood, containedSubstances);
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder otherNames(Set<String> otherNames) {
            this.otherNames = otherNames;
            return this;
        }

        public Builder alergenic(boolean alergenic) {
            isAlergenic = alergenic;
            return this;
        }

        public Builder category(Category category) {
            this.category = category;
            return this;
        }

        public Builder tags(Set<String> tags) {
            this.tags = tags;
            return this;
        }

        public Builder calories(BigDecimal calories) {
            this.calories = calories;
            return this;
        }

        public Builder carbs(BigDecimal carbs) {
            this.carbs = carbs;
            return this;
        }

        public Builder proteins(BigDecimal proteins) {
            this.proteins = proteins;
            return this;
        }

        public Builder lipids(BigDecimal lipids) {
            this.lipids = lipids;
            return this;
        }

        public Builder relatedFood(Set<Food> relatedFood) {
            this.relatedFood = relatedFood;
            return this;
        }

        public Builder containedSubstances(Set<Substance> containedSubstances) {
            this.containedSubstances = containedSubstances;
            return this;
        }
    }

    public static Map<String, Path> getExpressions() {
        return ImmutableMap.<String, Path>builder()
                .put("name", QFood.food.name)
                .put("otherNames", QFood.food.otherNames.any())
                .put("alergenic", QFood.food.isAlergenic)
                .put("category", QFood.food.category)
                .put("tags", QFood.food.tags.any())
                .put("calories", QFood.food.calories)
                .put("carbs", QFood.food.carbs)
                .put("proteins", QFood.food.carbs)
                .put("lipids", QFood.food.lipids)
                .put("relatedFood.name", QFood.food.relatedFood.any().name)
                .put("containedSubstances.name", QFood.food.containedSubstances.any().names.any())
                .build();

    }

}
