package io.github.hksm.controller;

import com.google.common.base.Strings;
import com.querydsl.core.types.Predicate;
import io.github.hksm.entity.Favorite;
import io.github.hksm.entity.QFavorite;
import io.github.hksm.entity.QUserData;
import io.github.hksm.entity.UserData;
import io.github.hksm.repository.FavoriteRepository;
import io.github.hksm.repository.UserDataRepository;
import io.github.hksm.util.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/favorite")
public class FavoriteController {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserDataRepository userDataRepository;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Favorite favorite, HttpServletRequest request) {
        if (Strings.isNullOrEmpty(request.getHeader("Authorization"))) {
            return ResponseEntity.noContent().build();
        }

        UserData currentUser = userDataRepository.findOne(QUserData.userData.username.eq(AuthUtils.getLoggedUsername(request.getHeader("Authorization").substring(7))));
        if (Objects.nonNull(currentUser)) {
            favorite.setUserData(currentUser);
            favorite.setDateTime(LocalDateTime.now());
            Favorite persisted = favoriteRepository.save(favorite);
            if (Objects.nonNull(persisted)) {
                return ResponseEntity.ok(persisted);
            }
        }
        return ResponseEntity.unprocessableEntity().body(favorite);
    }

    @GetMapping("/{foodId}")
    public ResponseEntity<?> getOne(@PathVariable("foodId") long id, HttpServletRequest request) {
        if (Strings.isNullOrEmpty(request.getHeader("Authorization"))) {
            return ResponseEntity.noContent().build();
        }
        String username = AuthUtils.getLoggedUsername(request.getHeader("Authorization").substring(7));
        Favorite favorite = favoriteRepository.findOne(QFavorite.favorite.food.id.eq(id).and(QFavorite.favorite.userData.username.eq(username)));
        if (Objects.nonNull(favorite)) {
            return ResponseEntity.ok(favorite);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(name = "size", defaultValue = "10") int size,
                                    @RequestParam(name = "page", defaultValue = "1") int page, HttpServletRequest request) {
        if (Strings.isNullOrEmpty(request.getHeader("Authorization"))) {
            return ResponseEntity.noContent().build();
        }
        String username = AuthUtils.getLoggedUsername(request.getHeader("Authorization").substring(7));
        Predicate predicate = QFavorite.favorite.userData.username.eq(username);
        Page<Favorite> favorite = favoriteRepository.findAll(predicate, new PageRequest(--page, size, new Sort(Sort.Direction.DESC, "dateTime")));
        return ResponseEntity.ok(favorite);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        try {
            favoriteRepository.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
