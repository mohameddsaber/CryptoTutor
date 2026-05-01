package com.ciphers.backend.dto;

public class MonoalphabeticRequest {
    private String text;
    private String key;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
