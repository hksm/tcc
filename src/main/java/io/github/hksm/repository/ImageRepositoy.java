package io.github.hksm.repository;

import io.github.hksm.entity.Image;
import io.github.hksm.entity.UserData;
import org.springframework.data.repository.CrudRepository;

/**
 * @author Marcos H. Henkes
 */
public interface ImageRepositoy extends CrudRepository<Image, Long> {
}
