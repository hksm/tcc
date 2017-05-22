package io.github.hksm.repository;

import io.github.hksm.entity.UserData;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

/**
 * @author Marcos H. Henkes
 */
public interface UserDataRepository extends CrudRepository<UserData, Long> {

    Optional<UserData> findByUsername(String username);

}