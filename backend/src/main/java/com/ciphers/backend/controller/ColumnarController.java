package com.ciphers.backend.controller;

import com.ciphers.backend.dto.CipherResponse;
import com.ciphers.backend.dto.MonoalphabeticRequest;
import com.ciphers.backend.service.ColumnarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/columnar")
@CrossOrigin(origins = "http://localhost:5173")
public class ColumnarController {

    @Autowired
    private ColumnarService columnarService;

    @PostMapping("/encrypt")
    public CipherResponse encrypt(@RequestBody MonoalphabeticRequest request) {
        return new CipherResponse(columnarService.encrypt(request.getText(), request.getKey()));
    }

    @PostMapping("/decrypt")
    public CipherResponse decrypt(@RequestBody MonoalphabeticRequest request) {
        return new CipherResponse(columnarService.decrypt(request.getText(), request.getKey()));
    }
}
