package com.revature.team2.bank3.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.revature.team2.bank3.domain.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private final SecretKey key;

    // Spring will automatically inject the property into the constructor parameter
    public JwtUtil(@Value("${app.jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .claim("accountId", user.getId())
                .claim("username", user.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key)
                .compact();
    }

    public String extractId(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("username", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}