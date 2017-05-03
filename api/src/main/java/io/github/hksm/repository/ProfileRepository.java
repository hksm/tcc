package io.github.hksm.repository;

import io.github.hksm.entity.Profile;
import io.github.hksm.entity.Substance;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Marcos H. Henkes
 */
public interface ProfileRepository extends PagingAndSortingRepository<Profile, Long>, QueryDslPredicateExecutor<Profile> {
}
