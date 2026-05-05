package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.service.RSAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.Map;

@RestController
@RequestMapping("/api/public-key/rsa")
@CrossOrigin(origins = "http://localhost:5173")
public class RSAController {

    @Autowired
    private RSAService rsaService;

    @PostMapping("/keys")
    public Map<String, String> generateKeys(@RequestBody Map<String, String> request) {
        BigInteger p = new BigInteger(request.get("p"));
        BigInteger q = new BigInteger(request.get("q"));
        BigInteger e = new BigInteger(request.get("e"));
        return rsaService.generateKeys(p, q, e);
    }

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody Map<String, String> request) {
        BigInteger m = new BigInteger(request.get("text"));
        BigInteger e = new BigInteger(request.get("e"));
        BigInteger n = new BigInteger(request.get("n"));
        return new CipherResponse(rsaService.encrypt(m, e, n));
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody Map<String, String> request) {
        BigInteger c = new BigInteger(request.get("text"));
        BigInteger d = new BigInteger(request.get("d"));
        BigInteger n = new BigInteger(request.get("n"));
        return new CipherResponse(rsaService.decrypt(c, d, n));
    }
}
