package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.dto.HillRequest;
import com.ciphers.backend.service.HillService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hill")
@CrossOrigin(origins = "*")
public class HillController {

    private final HillService hillService;

    public HillController(HillService hillService) {
        this.hillService = hillService;
    }

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody HillRequest request) {
        String result = hillService.encrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody HillRequest request) {
        String result = hillService.decrypt(request.getText(), request.getKey());
        return new CipherResponse(result);
    }
}
