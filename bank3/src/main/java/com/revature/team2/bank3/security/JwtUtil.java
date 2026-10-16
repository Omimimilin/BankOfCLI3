package com.revature.team2.bank3.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET = "mysecretkeymysecretkeymysecretkeymysecretkey"; // >= 256 bits
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username) // TODO: Set as ID
                .claim("username", username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    // public String extractUsername(String token) {
    // Jws<Claims> claimsJws =
    // Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
    // return claimsJws.getBody().get("username", String.class);
    // }

    // public String extractRole(String token) {
    // Jws<Claims> claimsJws =
    // Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
    // return claimsJws.getBody().get("role", String.class);
    // }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}