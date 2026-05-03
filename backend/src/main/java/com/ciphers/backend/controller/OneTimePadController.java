package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.dto.MonoalphabeticRequest;
import com.ciphers.backend.service.OneTimePadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onetimepad")
@CrossOrigin(origins = "http://localhost:5173")
public class OneTimePadController {

    @Autowired
    private OneTimePadService oneTimePadService;

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody MonoalphabeticRequest request) {
        String result = oneTimePadService.encrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody MonoalphabeticRequest request) {
        String result = oneTimePadService.decrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }
}
