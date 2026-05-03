package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherRequest;
import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.service.RailFenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/railfence")
@CrossOrigin(origins = "http://localhost:5173")
public class RailFenceController {

    @Autowired
    private RailFenceService railFenceService;

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody CipherRequest request) {
        return new CipherResponse(railFenceService.encrypt(request.getText(), request.getKey()));
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody CipherRequest request) {
        return new CipherResponse(railFenceService.decrypt(request.getText(), request.getKey()));
    }
}
