package com.ciphers.backend.service;

import org.springframework.stereotype.Service;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

@Service
public class RSAService {

    public String encrypt(BigInteger m, BigInteger e, BigInteger n) {
        try {
            return m.modPow(e, n).toString();
        } catch (Exception ex) {
            return "Error: " + ex.getMessage();
        }
    }

    public String decrypt(BigInteger c, BigInteger d, BigInteger n) {
        try {
            return c.modPow(d, n).toString();
        } catch (Exception ex) {
            return "Error: " + ex.getMessage();
        }
    }

    public Map<String, String> generateKeys(BigInteger p, BigInteger q, BigInteger e) {
        Map<String, String> results = new HashMap<>();
        try {
            BigInteger n = p.multiply(q);
            BigInteger phi = p.subtract(BigInteger.ONE).multiply(q.subtract(BigInteger.ONE));
            
            if (!e.gcd(phi).equals(BigInteger.ONE)) {
                results.put("success", "false");
                results.put("error", "e and phi(n) must be coprime");
                return results;
            }
            
            BigInteger d = e.modInverse(phi);
            
            results.put("n", n.toString());
            results.put("phi", phi.toString());
            results.put("d", d.toString());
            results.put("success", "true");
        } catch (Exception ex) {
            results.put("success", "false");
            results.put("error", ex.getMessage());
        }
        return results;
    }
}
