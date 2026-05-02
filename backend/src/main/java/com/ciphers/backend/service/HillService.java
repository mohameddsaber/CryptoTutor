package com.ciphers.backend.service;

import org.springframework.stereotype.Service;

@Service
public class HillService {

    public String encrypt(String text, int[][] key) {
        if (text == null || key == null || key.length != 3 || key[0].length != 3) {
            return "Invalid input or key matrix.";
        }
        StringBuilder res = new StringBuilder();
        text = text.toUpperCase().replaceAll("[^A-Z]", "");
        while (text.length() % 3 != 0) {
            text += 'X';
        }
        for (int i = 0; i < text.length(); i += 3) {
            int[] p = new int[3];
            p[0] = text.charAt(i) - 'A';
            p[1] = text.charAt(i + 1) - 'A';
            p[2] = text.charAt(i + 2) - 'A';

            int[] c = new int[3];
            for (int row = 0; row < 3; row++) {
                c[row] = 0;
                for (int col = 0; col < 3; col++) {
                    c[row] += p[col] * key[row][col];
                }
            }
            for (int j = 0; j < 3; j++) {
                res.append((char) ((c[j] % 26) + 'A'));
            }
        }
        return res.toString();
    }

    public String decrypt(String text, int[][] key) {
        try {
            int[][] invKey = inverse(key);
            return encrypt(text, invKey);
        } catch (IllegalArgumentException e) {
            return "Error: " + e.getMessage();
        }
    }

    public int[][] inverse(int[][] key) {
        int det = key[0][0] * (key[1][1] * key[2][2] - key[1][2] * key[2][1])
                - key[0][1] * (key[1][0] * key[2][2] - key[1][2] * key[2][0])
                + key[0][2] * (key[1][0] * key[2][1] - key[1][1] * key[2][0]);

        det = ((det % 26) + 26) % 26;

        int detInv = modInverse(det, 26);
        if (detInv == -1) {
            throw new IllegalArgumentException("Key matrix is not invertible mod 26");
        }

        int[][] cof = new int[3][3];

        cof[0][0] = (key[1][1] * key[2][2] - key[1][2] * key[2][1]);
        cof[0][1] = -(key[1][0] * key[2][2] - key[1][2] * key[2][0]);
        cof[0][2] = (key[1][0] * key[2][1] - key[1][1] * key[2][0]);

        cof[1][0] = -(key[0][1] * key[2][2] - key[0][2] * key[2][1]);
        cof[1][1] = (key[0][0] * key[2][2] - key[0][2] * key[2][0]);
        cof[1][2] = -(key[0][0] * key[2][1] - key[0][1] * key[2][0]);

        cof[2][0] = (key[0][1] * key[1][2] - key[0][2] * key[1][1]);
        cof[2][1] = -(key[0][0] * key[1][2] - key[0][2] * key[1][0]);
        cof[2][2] = (key[0][0] * key[1][1] - key[0][1] * key[1][0]);

        int[][] adj = new int[3][3];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                adj[i][j] = cof[j][i];
            }
        }

        int[][] inv = new int[3][3];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                inv[i][j] = ((adj[i][j] * detInv) % 26 + 26) % 26;
            }
        }

        return inv;
    }

    public int modInverse(int a, int m) {
        a = ((a % m) + m) % m;
        for (int x = 1; x < m; x++) {
            if ((a * x) % m == 1) {
                return x;
            }
        }
        return -1;
    }
}
