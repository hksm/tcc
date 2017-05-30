package io.github.hksm.repository;

import io.github.hksm.entity.Favorite;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Marcos H. Henkes
 */
public interface FavoriteRepository extends PagingAndSortingRepository<Favorite, Long>, QueryDslPredicateExecutor<Favorite> {
}
