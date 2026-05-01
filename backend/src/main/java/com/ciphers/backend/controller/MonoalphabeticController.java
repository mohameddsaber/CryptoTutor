package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.dto.MonoalphabeticRequest;
import com.ciphers.backend.service.MonoalphabeticService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/monoalphabetic")
@CrossOrigin(origins = "*")
public class MonoalphabeticController {

    private final MonoalphabeticService monoalphabeticService;

    public MonoalphabeticController(MonoalphabeticService monoalphabeticService) {
        this.monoalphabeticService = monoalphabeticService;
    }

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody MonoalphabeticRequest request) {
        String result = monoalphabeticService.encrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody MonoalphabeticRequest request) {
        String result = monoalphabeticService.decrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }
}
