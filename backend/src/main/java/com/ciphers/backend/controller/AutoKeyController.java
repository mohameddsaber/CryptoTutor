package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.dto.MonoalphabeticRequest;
import com.ciphers.backend.service.AutoKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/autokey")
@CrossOrigin(origins = "http://localhost:5173")
public class AutoKeyController {

    @Autowired
    private AutoKeyService autoKeyService;

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody MonoalphabeticRequest request) {
        return new CipherResponse(autoKeyService.encrypt(request.getText(), request.getKey()));
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody MonoalphabeticRequest request) {
        return new CipherResponse(autoKeyService.decrypt(request.getText(), request.getKey()));
    }
}
