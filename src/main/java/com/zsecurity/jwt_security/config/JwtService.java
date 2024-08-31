package com.zsecurity.jwt_security.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import com.google.common.io.BaseEncoding;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY = GenerateEncryptionKey();

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // generate token without getting extractClaims information
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            Map<String, Object> extractClaims,
            UserDetails userDetails
    ) {
        extractClaims.put("role", userDetails.getAuthorities().iterator().next().getAuthority());
        return Jwts
                .builder()
                .setClaims(extractClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date((System.currentTimeMillis())))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24)) // valid for 24 hours and 1000 milliseconds
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // validate token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private static String GenerateEncryptionKey() {
        /* *
         * Generates a 256 bit (32 byte) AES encryption key and prints the base64 representation. This is
         * included for demonstration purposes only. You should generate your own key, and consult your
         * security team about best practices. Please remember that encryption keys should be handled with
         * a comprehensive security policy.
         * * * * * * *
         * * 8 bit = 1 byte
         */
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);

        String encryptionKey = BaseEncoding.base64().encode(key);
        byte[] hexKey = BaseEncoding.base64().decode(encryptionKey);
        System.out.println("SECRET_KEY: " + bytesToHex(hexKey));

        return bytesToHex(hexKey);
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
