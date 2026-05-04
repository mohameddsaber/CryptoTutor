package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
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
    public CipherResponse encrypt(@RequestBody MonoalphabeticRequest request) {
        return new CipherResponse(aesService.encrypt(request.getText(), request.getKey()));
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody MonoalphabeticRequest request) {
        return new CipherResponse(aesService.decrypt(request.getText(), request.getKey()));
    }
}
