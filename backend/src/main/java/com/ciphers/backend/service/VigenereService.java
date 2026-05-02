package com.ciphers.backend.service;

import org.springframework.stereotype.Service;

@Service
public class VigenereService {

    public String encrypt(String plainText, String key) {
        if (key == null || key.isEmpty()) return "Error: Key cannot be empty";
        
        plainText = plainText.toUpperCase().replaceAll("[^A-Z]", "");
        key = key.toUpperCase().replaceAll("[^A-Z]", "");

        StringBuilder ciphertext = new StringBuilder();

        for (int i = 0; i < plainText.length(); i++) {
            int p = plainText.charAt(i) - 'A';
            int k = key.charAt(i % key.length()) - 'A';
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

        for (int i = 0; i < cipherText.length(); i++) {
            int c = cipherText.charAt(i) - 'A';
            int k = key.charAt(i % key.length()) - 'A';
            int p = (c - k + 26) % 26;
            plaintext.append((char) (p + 'A'));
        }

        return plaintext.toString();
    }
}
