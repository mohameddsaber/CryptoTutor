package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.dto.MonoalphabeticRequest;
import com.ciphers.backend.service.PlayfairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/playfair")
@CrossOrigin(origins = "http://localhost:5173")
public class PlayfairController {

    @Autowired
    private PlayfairService playfairService;

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody MonoalphabeticRequest request) {
        String result = playfairService.encrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody MonoalphabeticRequest request) {
        String result = playfairService.decrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }
}
