package com.ciphers.backend.dto;

public class HillRequest {
    private String text;
    private int[][] key;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int[][] getKey() {
        return key;
    }

    public void setKey(int[][] key) {
        this.key = key;
    }
}
