package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.service.MD5Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/hash/md5")
@CrossOrigin(origins = "http://localhost:5173")
public class MD5Controller {

    @Autowired
    private MD5Service md5Service;

    @PostMapping
    public CipherResponse hash(@RequestBody Map<String, String> request) {
        String message = request.get("text");
        return new CipherResponse(md5Service.hash(message));
    }
}
