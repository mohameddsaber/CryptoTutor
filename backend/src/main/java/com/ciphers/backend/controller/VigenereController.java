package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.dto.MonoalphabeticRequest;
import com.ciphers.backend.service.VigenereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vigenere")
@CrossOrigin(origins = "http://localhost:5173")
public class VigenereController {

    @Autowired
    private VigenereService vigenereService;

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody MonoalphabeticRequest request) {
        return new CipherResponse(vigenereService.encrypt(request.getText(), request.getKey()));
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody MonoalphabeticRequest request) {
        return new CipherResponse(vigenereService.decrypt(request.getText(), request.getKey()));
    }
}
