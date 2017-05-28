package io.github.hksm.repository;

import io.github.hksm.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

/**
 * @author Marcos H. Henkes
 */
public interface NotificationRepository extends JpaRepository<Notification, Long>, QueryDslPredicateExecutor<Notification> {
}
