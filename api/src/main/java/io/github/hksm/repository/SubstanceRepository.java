package io.github.hksm.repository;

import io.github.hksm.entity.Substance;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Marcos H. Henkes
 */
public interface SubstanceRepository extends PagingAndSortingRepository<Substance, Long>, QueryDslPredicateExecutor<Substance> {
}
