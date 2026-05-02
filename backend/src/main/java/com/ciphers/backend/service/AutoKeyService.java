package com.ciphers.backend.service;

import org.springframework.stereotype.Service;

@Service
public class AutoKeyService {

    public String encrypt(String plainText, String key) {
        if (key == null || key.isEmpty()) return "Error: Key cannot be empty";
        
        plainText = plainText.toUpperCase().replaceAll("[^A-Z]", "");
        key = key.toUpperCase().replaceAll("[^A-Z]", "");

        StringBuilder ciphertext = new StringBuilder();
        StringBuilder fullKey = new StringBuilder(key);
        fullKey.append(plainText);

        for (int i = 0; i < plainText.length(); i++) {
            int p = plainText.charAt(i) - 'A';
            int k = fullKey.charAt(i) - 'A';
            int c = (p + k) % 26;
            ciphertext.append((char) (c + 'A'));
        }

        return ciphertext.toString();
    }

    public String decrypt(String cipherText, String key) {
        if (key == null || key.isEmpty()) return "Error: Key cannot be empty";

        cipherText = cipherText.toUpperCase().replaceAll("[^A-Z]", "");
        key = key.toUpperCase().replaceAll("[^A-Z]", "");

        StringBuilder plaintext = new StringBuilder();
        StringBuilder currentKey = new StringBuilder(key);

        for (int i = 0; i < cipherText.length(); i++) {
            int c = cipherText.charAt(i) - 'A';
            int k = currentKey.charAt(i) - 'A';
            int p = (c - k + 26) % 26;

            char plainChar = (char)(p + 'A');
            plaintext.append(plainChar);
            currentKey.append(plainChar);
        }

        return plaintext.toString();
    }
}
