package io.github.hksm.controller;

import com.google.common.collect.ImmutableSet;
import io.github.hksm.entity.QUserData;
import io.github.hksm.entity.UserData;
import io.github.hksm.repository.UserDataRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Inject
    private UserDataRepository userDataRepository;

    private static final String SECRET_KEY = "thisismysecretkey";

    @PostMapping("/login")
    public LoginResponse login(@RequestBody UserLogin login) throws ServletException {
        if (login.username == null || login.password == null) {
            throw new ServletException("Invalid login");
        }
        UserData userData = userDataRepository.findOne(QUserData.userData.username.eq(login.username));
        if (Objects.isNull(userData) || !BCrypt.checkpw(login.password, userData.getPassword())) {
            throw new ServletException("Invalid login");
        }

        return new LoginResponse(Jwts.builder().setSubject(login.username)
                .claim("roles", userData.getRoles()).setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY).compact());
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/role/{roleParam}")
    public Boolean checkRole(@PathVariable("roleParam") final String role, HttpServletRequest request) throws ServletException {
        final Claims claims = (Claims) request.getAttribute("claims");
        return ((List<String>) claims.get("roles")).contains(role);
    }

    @PostMapping("/register")
    public ResponseEntity add(@RequestBody UserData user) {
        try {
            user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
            user.setRoles(ImmutableSet.of("user"));
            user.setEnabled(true);
            userDataRepository.save(user);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    private static class UserLogin {
        public String username;
        public String password;
    }

    private static class LoginResponse {
        public String token;

        public LoginResponse(final String token) {
            this.token = token;
        }
    }

}
