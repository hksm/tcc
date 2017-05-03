package io.github.hksm.controller;

import io.github.hksm.entity.Profile;
import io.github.hksm.entity.QProfile;
import io.github.hksm.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Profile profile) {
        Profile persisted = profileRepository.save(profile);
        if (Objects.nonNull(persisted)) {
            return ResponseEntity.ok(persisted);
        }
        return ResponseEntity.unprocessableEntity().body(profile);
    }

    @GetMapping("{userId}")
    public ResponseEntity<?> get(@PathVariable long userId) {
        Profile profile = profileRepository.findOne(QProfile.profile.userId.eq(userId));
        if (Objects.nonNull(profile)) {
            return ResponseEntity.ok(profile);
        }
        return ResponseEntity.noContent().build();
    }
}
