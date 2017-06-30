package io.github.hksm.controller;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import io.github.hksm.entity.Notification;
import io.github.hksm.entity.QNotification;
import io.github.hksm.entity.QUserData;
import io.github.hksm.entity.UserData;
import io.github.hksm.repository.NotificationRepository;
import io.github.hksm.repository.UserDataRepository;
import io.github.hksm.util.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Objects;
import java.util.stream.StreamSupport;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserDataRepository userDataRepository;

    @GetMapping
    public ResponseEntity<?> getLastFive(HttpServletRequest request) {
        if (Strings.isNullOrEmpty(request.getHeader("Authorization"))) {
            return ResponseEntity.noContent().build();
        }

        UserData currentUser = userDataRepository.findOne(QUserData.userData.username.eq(AuthUtils.getLoggedUsername(request.getHeader("Authorization").substring(7))));
        if (Objects.isNull(currentUser)) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        Iterable<Notification> notifications = notificationRepository.findAll(QNotification.notification.dispensed.isFalse()
                .and(QNotification.notification.userData.id.eq(currentUser.getId())), new Sort(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(Lists.newArrayList(notifications));
    }

    @GetMapping("/count")
    public ResponseEntity<?> count(HttpServletRequest request) {
        if (Strings.isNullOrEmpty(request.getHeader("Authorization"))) {
            return ResponseEntity.noContent().build();
        }
        UserData currentUser = userDataRepository.findOne(QUserData.userData.username.eq(AuthUtils.getLoggedUsername(request.getHeader("Authorization").substring(7))));
        if (Objects.isNull(currentUser)) {
            return ResponseEntity.ok(0);
        }
        long count = notificationRepository.count(QNotification.notification.dispensed.isFalse()
                .and(QNotification.notification.userData.id.eq(currentUser.getId())));
        return ResponseEntity.ok(count);
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody String message) {
        Iterable<UserData> admins = userDataRepository.findAll(QUserData.userData.roles.contains("admin"));
        try {
            StreamSupport.stream(admins.spliterator(), false).forEach(admin -> notificationRepository.save(new Notification(null, message, admin, false)));
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().build();
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        try {
            notificationRepository.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }

    }

}
