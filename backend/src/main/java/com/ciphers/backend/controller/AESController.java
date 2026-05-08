package com.ciphers.backend.controller;

import com.ciphers.backend.dto.AESResponse;
import com.ciphers.backend.dto.MonoalphabeticRequest;
import com.ciphers.backend.service.AESService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aes")
@CrossOrigin(origins = "http://localhost:5173")
public class AESController {

    @Autowired
    private AESService aesService;

    @PostMapping("/encrypt")
    public AESResponse encrypt(@RequestBody MonoalphabeticRequest request) {
        return aesService.encrypt(request.getText(), request.getKey());
    }

    @PostMapping("/decrypt")
    public AESResponse decrypt(@RequestBody MonoalphabeticRequest request) {
        return aesService.decrypt(request.getText(), request.getKey());
    }
}
