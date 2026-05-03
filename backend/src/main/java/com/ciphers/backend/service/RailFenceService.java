package com.ciphers.backend.service;

import org.springframework.stereotype.Service;

@Service
public class RailFenceService {

    public String encrypt(String text, int depth) {
        if (depth <= 1) return text.toUpperCase().replaceAll("[^A-Z]", "");
        
        text = text.toUpperCase().replaceAll("[^A-Z]", "");
        int length = text.length();
        int cols = (int) Math.ceil((double) length / depth);
        char[][] matrix = new char[depth][cols];
        
        int index = 0;
        for (int i = 0; i < cols; i++) {
            for (int j = 0; j < depth; j++) {
                if (index < length) {
                    matrix[j][i] = text.charAt(index++);
                } else {
                    matrix[j][i] = 'X';
                }
            }
        }
        
        StringBuilder res = new StringBuilder();
        for (int row = 0; row < depth; row++) {
            for (int col = 0; col < cols; col++) {
                res.append(matrix[row][col]);
            }
        }
        return res.toString();
    }

    public String decrypt(String text, int depth) {
        if (depth <= 1) return text;
        
        int length = text.length();
        int cols = (int) Math.ceil((double) length / depth);
        if (length != depth * cols) return "Error: Ciphertext length must be a multiple of depth";
        
        char[][] matrix = new char[depth][cols];
        int index = 0;
        for (int row = 0; row < depth; row++) {
            for (int col = 0; col < cols; col++) {
                matrix[row][col] = text.charAt(index++);
            }
        }
        
        StringBuilder res = new StringBuilder();
        for (int col = 0; col < cols; col++) {
            for (int row = 0; row < depth; row++) {
                res.append(matrix[row][col]);
            }
        }
        // Remove trailing 'X's that were added during encryption if they exist
        return res.toString().replaceAll("X+$", "");
    }
}
