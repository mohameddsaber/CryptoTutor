package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherRequest;
import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.service.CaesarService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/caesar")
@CrossOrigin(origins = "*")
public class CaesarController {

    private final CaesarService caesarService;

    public CaesarController(CaesarService caesarService) {
        this.caesarService = caesarService;
    }

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody CipherRequest request) {
        String result = caesarService.encrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody CipherRequest request) {
        String result = caesarService.decrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }
}
