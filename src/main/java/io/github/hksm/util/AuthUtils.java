package io.github.hksm.util;

import io.jsonwebtoken.Jwts;

/**
 * @author Marcos H. Henkes
 */
public class AuthUtils {

    private static final String SECRET_KEY = "thisismysecretkey";

    public static String getLoggedUsername(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody().getSubject();
    }

}
