package com.ciphers.backend.service;

import org.springframework.stereotype.Service;

@Service
public class OneTimePadService {

    public String encrypt(String text, String key) {
        text = text.toUpperCase().replaceAll("[^A-Z]", "");
        key = key.toUpperCase().replaceAll("[^A-Z]", "");

        if (key.length() < text.length()) {
            return "Error: Key must be at least as long as the text";
        }

        StringBuilder res = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            int p = text.charAt(i) - 'A';
            int c = key.charAt(i) - 'A';
            char ch = (char) ((p + c) % 26 + 'A');
            res.append(ch);
        }
        return res.toString();
    }

    public String decrypt(String text, String key) {
        text = text.toUpperCase().replaceAll("[^A-Z]", "");
        key = key.toUpperCase().replaceAll("[^A-Z]", "");

        if (key.length() < text.length()) {
            return "Error: Key must be at least as long as the text";
        }

        StringBuilder res = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            int p = text.charAt(i) - 'A';
            int c = key.charAt(i) - 'A';
            char ch = (char) ((p - c + 26) % 26 + 'A');
            res.append(ch);
        }
        return res.toString();
    }
}
