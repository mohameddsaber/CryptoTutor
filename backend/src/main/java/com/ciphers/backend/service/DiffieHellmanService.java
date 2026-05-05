package com.ciphers.backend.service;

import org.springframework.stereotype.Service;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

@Service
public class DiffieHellmanService {

    public Map<String, String> calculateKeys(BigInteger q, BigInteger alpha, BigInteger xa, BigInteger xb) {
        Map<String, String> results = new HashMap<>();
        try {
            // Ya = alpha^xa mod q
            BigInteger ya = alpha.modPow(xa, q);
            // Yb = alpha^xb mod q
            BigInteger yb = alpha.modPow(xb, q);
            
            // Ka = Yb^xa mod q
            BigInteger ka = yb.modPow(xa, q);
            // Kb = Ya^xb mod q
            BigInteger kb = ya.modPow(xb, q);
            
            results.put("ya", ya.toString());
            results.put("yb", yb.toString());
            results.put("ka", ka.toString());
            results.put("kb", kb.toString());
            results.put("success", "true");
        } catch (Exception e) {
            results.put("success", "false");
            results.put("error", e.getMessage());
        }
        return results;
    }
}
