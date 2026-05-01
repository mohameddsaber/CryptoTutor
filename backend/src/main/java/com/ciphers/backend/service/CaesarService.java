package com.ciphers.backend.service;

import org.springframework.stereotype.Service;

@Service
public class CaesarService {

    public String encrypt(String message, int key) {
        StringBuilder res = new StringBuilder();
        for (char ch : message.toCharArray()) {
            if (Character.isLetter(ch)) {
                char base = Character.isUpperCase(ch) ? 'A' : 'a';
                char encC = (char) ((ch - base + (key % 26) + 26) % 26 + base);
                res.append(encC);
            } else {
                res.append(ch);
            }
        }
        return res.toString();
    }

    public String decrypt(String message, int key) {
        return encrypt(message, -key);
    }

    public int analyse(String plainText, String cipherText) {
        if (plainText == null || plainText.isEmpty() || cipherText == null || cipherText.isEmpty()) {
            return 0;
        }
        char p = Character.toLowerCase(plainText.charAt(0));
        char c = Character.toLowerCase(cipherText.charAt(0));
        return (c - p + 26) % 26;
    }
}
