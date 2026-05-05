package com.ciphers.backend.controller;

import com.ciphers.backend.service.DiffieHellmanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.Map;

@RestController
@RequestMapping("/api/public-key/diffie-hellman")
@CrossOrigin(origins = "http://localhost:5173")
public class DiffieHellmanController {

    @Autowired
    private DiffieHellmanService diffieHellmanService;

    @PostMapping("/calculate")
    public Map<String, String> calculate(@RequestBody Map<String, String> request) {
        BigInteger q = new BigInteger(request.get("q"));
        BigInteger alpha = new BigInteger(request.get("alpha"));
        BigInteger xa = new BigInteger(request.get("xa"));
        BigInteger xb = new BigInteger(request.get("xb"));
        return diffieHellmanService.calculateKeys(q, alpha, xa, xb);
    }
}
