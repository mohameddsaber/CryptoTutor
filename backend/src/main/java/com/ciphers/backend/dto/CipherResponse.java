package com.ciphers.backend.dto;

public class CipherResponse {
    private String result;

    public CipherResponse() {}

    public CipherResponse(String result) {
        this.result = result;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
