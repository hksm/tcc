package io.github.hksm.controller;

import io.github.hksm.entity.Profile;
import io.github.hksm.entity.QProfile;
import io.github.hksm.entity.UserData;
import io.github.hksm.repository.ProfileRepository;
import io.github.hksm.repository.UserDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserDataRepository userDataRepository;

    @PostMapping("{username}")
    public ResponseEntity<?> add(@PathVariable String username, @RequestBody Profile profile) {
        Optional<UserData> user = userDataRepository.findByUsername(username);
        if (user.isPresent()) {
            profile.setUserData(user.get());
            Profile persisted = profileRepository.save(profile);
            if (Objects.nonNull(persisted)) {
                return ResponseEntity.ok(persisted);
            }
        }
        return ResponseEntity.unprocessableEntity().body(profile);
    }

    @GetMapping("{userId}")
    public ResponseEntity<?> get(@PathVariable long userId) {
        Profile profile = profileRepository.findOne(QProfile.profile.userData.id.eq(userId));
        if (Objects.nonNull(profile)) {
            return ResponseEntity.ok(profile);
        }
        return ResponseEntity.noContent().build();
    }
}
