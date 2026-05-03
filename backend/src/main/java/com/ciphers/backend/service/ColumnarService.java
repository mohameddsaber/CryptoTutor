package com.ciphers.backend.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ColumnarService {

    private List<Integer> getKeyOrder(String key) {
        key = key.toUpperCase().replaceAll("[^A-Z]", "");
        int n = key.length();
        if (n == 0) return new ArrayList<>();

        // Create pairs of (char, originalIndex)
        Object[][] pairs = new Object[n][2];
        for (int i = 0; i < n; i++) {
            pairs[i][0] = key.charAt(i);
            pairs[i][1] = i;
        }

        // Sort by character, maintaining stable order for identical chars
        Arrays.sort(pairs, (a, b) -> ((Character) a[0]).compareTo((Character) b[0]));

        // keyOrder[alphabeticalRank] = originalIndex
        // For example if key is "DBAC", alphabetical is "ABCD"
        // pairs: [A, 2], [B, 1], [C, 3], [D, 0]
        // keyOrder: [2, 1, 3, 0]
        List<Integer> keyOrder = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            keyOrder.add((Integer) pairs[i][1]);
        }
        return keyOrder;
    }

    public String encrypt(String text, String key) {
        if (key == null || key.isEmpty()) return "Error: Key cannot be empty";
        
        List<Integer> keyOrder = getKeyOrder(key);
        text = text.toUpperCase().replaceAll("[^A-Z]", "");
        int cols = keyOrder.size();
        int rows = (int) Math.ceil((double) text.length() / cols);
        char[][] matrix = new char[rows][cols];
        
        int index = 0;
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (index < text.length()) {
                    matrix[row][col] = text.charAt(index++);
                } else {
                    matrix[row][col] = 'X';
                }
            }
        }
        
        StringBuilder res = new StringBuilder();
        // In the original lab: for(int col=0; col<cols; col++) { colIndex = keyOrder.indexOf(col); ... }
        // My getKeyOrder returns the list of column indices in alphabetical order.
        // So we just iterate through keyOrder.
        for (int colIndex : keyOrder) {
            for (int row = 0; row < rows; row++) {
                res.append(matrix[row][colIndex]);
            }
        }
        return res.toString();
    }

    public String decrypt(String text, String key) {
        if (key == null || key.isEmpty()) return "Error: Key cannot be empty";
        
        List<Integer> keyOrder = getKeyOrder(key);
        text = text.toUpperCase().replaceAll("[^A-Z]", "");
        int cols = keyOrder.size();
        if (cols == 0) return "";
        int rows = (int) Math.ceil((double) text.length() / cols);
        
        if (text.length() != rows * cols) return "Error: Ciphertext length invalid for key size";

        char[][] matrix = new char[rows][cols];
        int index = 0;

        // Fill columns in alphabetical order
        for (int colIndex : keyOrder) {
            for (int row = 0; row < rows; row++) {
                if (index < text.length()) {
                    matrix[row][colIndex] = text.charAt(index++);
                }
            }
        }

        StringBuilder res = new StringBuilder();
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                res.append(matrix[row][col]);
            }
        }
        return res.toString().replaceAll("X+$", "");
    }
}
