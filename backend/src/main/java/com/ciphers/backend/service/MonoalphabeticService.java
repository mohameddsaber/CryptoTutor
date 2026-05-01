package com.ciphers.backend.service;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.HashMap;

@Service
public class MonoalphabeticService {

    public String encrypt(String text, String key) {
        if (text == null || key == null || key.length() < 26) return text;
        
        String alphabet = "abcdefghijklmnopqrstuvwxyz";
        HashMap<Character, Character> map = new HashMap<>();
        for (int i = 0; i < 26; i++) {
            map.put(alphabet.charAt(i), key.charAt(i));
            // Add uppercase support for a better UI experience
            map.put(Character.toUpperCase(alphabet.charAt(i)), Character.toUpperCase(key.charAt(i)));
        }
        
        StringBuilder res = new StringBuilder();
        for (char ch : text.toCharArray()) {
            res.append(map.getOrDefault(ch, ch));
        }
        return res.toString();
    }

    public String decrypt(String text, String key) {
        if (text == null || key == null || key.length() < 26) return text;
        
        String alphabet = "abcdefghijklmnopqrstuvwxyz";
        HashMap<Character, Character> map = new HashMap<>();
        for (int i = 0; i < 26; i++) {
            map.put(key.charAt(i), alphabet.charAt(i));
            // Add uppercase support for a better UI experience
            map.put(Character.toUpperCase(key.charAt(i)), Character.toUpperCase(alphabet.charAt(i)));
        }
        
        StringBuilder res = new StringBuilder();
        for (char ch : text.toCharArray()) {
            res.append(map.getOrDefault(ch, ch));
        }
        return res.toString();
    }

    public String analyseUsingCharFrequency(String cipher) {
        if (cipher == null || cipher.isEmpty()) return "";
        
        int[] freq = new int[26];
        // Count frequency of letters
        for (char ch : cipher.toLowerCase().toCharArray()) {
            if (Character.isLetter(ch)) {
                freq[ch - 'a']++;
            }
        }

        // Store letters a-z
        Character[] letters = new Character[26];
        for (int i = 0; i < 26; i++) {
            letters[i] = (char) ('a' + i);
        }

        // Sort letters by descending frequency
        Arrays.sort(letters, (a, b) -> Integer.compare(freq[b - 'a'], freq[a - 'a']));

        // Convert sorted array to string
        StringBuilder result = new StringBuilder();
        for (char ch : letters) {
            result.append(ch);
        }

        return result.toString();
    }
}
