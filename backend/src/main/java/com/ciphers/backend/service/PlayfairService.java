package com.ciphers.backend.service;

import org.springframework.stereotype.Service;

@Service
public class PlayfairService {

    private char[][] generateMatrix(String key) {
        char[][] matrix = new char[5][5];
        String alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
        key = key.toUpperCase().replaceAll("[^A-Z]", "").replace("J", "I");
        String combined = key + alphabet;
        StringBuilder unique = new StringBuilder();

        for (char c : combined.toCharArray()) {
            if (unique.indexOf(String.valueOf(c)) == -1) {
                unique.append(c);
            }
        }

        for (int i = 0; i < 25; i++) {
            matrix[i / 5][i % 5] = unique.charAt(i);
        }
        return matrix;
    }

    private String prepareText(String text) {
        text = text.toUpperCase().replaceAll("[^A-Z]", "").replace("J", "I");
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < text.length(); i++) {
            sb.append(text.charAt(i));
            if (i < text.length() - 1 && text.charAt(i) == text.charAt(i + 1)) {
                sb.append('X');
            }
        }
        if (sb.length() % 2 != 0) {
            sb.append('X');
        }
        return sb.toString();
    }

    private int[] findPosition(char[][] matrix, char c) {
        for (int row = 0; row < 5; row++) {
            for (int col = 0; col < 5; col++) {
                if (matrix[row][col] == c) {
                    return new int[]{row, col};
                }
            }
        }
        return null;
    }

    public String encrypt(String text, String key) {
        char[][] matrix = generateMatrix(key);
        String preparedText = prepareText(text);
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < preparedText.length(); i += 2) {
            char c1 = preparedText.charAt(i);
            char c2 = preparedText.charAt(i + 1);
            int[] pos1 = findPosition(matrix, c1);
            int[] pos2 = findPosition(matrix, c2);

            if (pos1[0] == pos2[0]) {
                result.append(matrix[pos1[0]][(pos1[1] + 1) % 5]);
                result.append(matrix[pos2[0]][(pos2[1] + 1) % 5]);
            } else if (pos1[1] == pos2[1]) {
                result.append(matrix[(pos1[0] + 1) % 5][pos1[1]]);
                result.append(matrix[(pos2[0] + 1) % 5][pos2[1]]);
            } else {
                result.append(matrix[pos1[0]][pos2[1]]);
                result.append(matrix[pos2[0]][pos1[1]]);
            }
        }
        return result.toString();
    }

    public String decrypt(String text, String key) {
        char[][] matrix = generateMatrix(key);
        text = text.toUpperCase().replaceAll("[^A-Z]", "").replace("J", "I");
        if (text.length() % 2 != 0) return "Invalid Ciphertext length";

        StringBuilder result = new StringBuilder();
        for (int i = 0; i < text.length(); i += 2) {
            char c1 = text.charAt(i);
            char c2 = text.charAt(i + 1);
            int[] pos1 = findPosition(matrix, c1);
            int[] pos2 = findPosition(matrix, c2);

            if (pos1[0] == pos2[0]) {
                result.append(matrix[pos1[0]][(pos1[1] + 4) % 5]);
                result.append(matrix[pos2[0]][(pos2[1] + 4) % 5]);
            } else if (pos1[1] == pos2[1]) {
                result.append(matrix[(pos1[0] + 4) % 5][pos1[1]]);
                result.append(matrix[(pos2[0] + 4) % 5][pos2[1]]);
            } else {
                result.append(matrix[pos1[0]][pos2[1]]);
                result.append(matrix[pos2[0]][pos1[1]]);
            }
        }
        return result.toString();
    }
}
