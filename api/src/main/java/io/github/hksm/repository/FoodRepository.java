package io.github.hksm.repository;

import io.github.hksm.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Marcos H. Henkes
 */
public interface FoodRepository extends PagingAndSortingRepository<Food, Long>, QueryDslPredicateExecutor<Food> {
}
