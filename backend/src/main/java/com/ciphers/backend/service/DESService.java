package com.ciphers.backend.service;

import org.springframework.stereotype.Service;
import java.math.BigInteger;

@Service
public class DESService {

    // --- 1. PERMUTATION TABLES ---
    private static final int[] IP = {
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6,
        64, 56, 48, 40, 32, 24, 16, 8,
        57, 49, 41, 33, 25, 17,  9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7
    };
    private static final int[] FP = {
        40, 8, 48, 16, 56, 24, 64, 32,
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41,  9, 49, 17, 57, 25
    };
    private static final int[] E = {
        32,  1,  2,  3,  4,  5,
         4,  5,  6,  7,  8,  9,
         8,  9, 10, 11, 12, 13,
        12, 13, 14, 15, 16, 17,
        16, 17, 18, 19, 20, 21,
        20, 21, 22, 23, 24, 25,
        24, 25, 26, 27, 28, 29,
        28, 29, 30, 31, 32,  1
    };
    private static final int[] P = {
        16,  7, 20, 21,
        29, 12, 28, 17,
         1, 15, 23, 26,
         5, 18, 31, 10,
         2,  8, 24, 14,
        32, 27,  3,  9,
        19, 13, 30,  6,
        22, 11,  4, 25
    };

    // --- 2. KEY SCHEDULING TABLES ---
    private static final int[] PC1 = {
        57, 49, 41, 33, 25, 17,  9,
         1, 58, 50, 42, 34, 26, 18,
        10,  2, 59, 51, 43, 35, 27,
        19, 11,  3, 60, 52, 44, 36,
        63, 55, 47, 39, 31, 23, 15,
         7, 62, 54, 46, 38, 30, 22,
        14,  6, 61, 53, 45, 37, 29,
        21, 13,  5, 28, 20, 12,  4
    };
    private static final int[] PC2 = {
        14, 17, 11, 24,  1,  5,
         3, 28, 15,  6, 21, 10,
        23, 19, 12,  4, 26,  8,
        16,  7, 27, 20, 13,  2,
        41, 52, 31, 37, 47, 55,
        30, 40, 51, 45, 33, 48,
        44, 49, 39, 56, 34, 53,
        46, 42, 50, 36, 29, 32
    };
    private static final int[] SHIFTS = {
        1, 1, 2, 2, 2, 2, 2, 2,
        1, 2, 2, 2, 2, 2, 2, 1
    };

    // --- 3. S-BOXES ---
    private static final int[][][] SBOX = {
        {{14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7}, 
         {0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8},
         {4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0},
         {15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13}},
        {{15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10},
         {3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5},
         {0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15},
         {13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9}},
        {{10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8},
         {13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1},
         {13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7},
         {1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12}},
        {{7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15},
         {13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9},
         {10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4},
         {3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14}},
        {{2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9},
         {14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6},
         {4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14},
         {11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3}},
        {{12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11},
         {10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8},
         {9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6},
         {4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13}},
        {{4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1},
         {13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6},
         {1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2},
         {6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12}},
        {{13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7},
         {1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2},
         {7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8},
        {2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11}}
    };

    private String hexToBinary(String hex) {
        StringBuilder binary = new StringBuilder();
        for (int i = 0; i < hex.length(); i++) {
            int val = Integer.parseInt(hex.charAt(i) + "", 16);
            String bin = Integer.toBinaryString(val);
            while (bin.length() < 4) bin = "0" + bin;
            binary.append(bin);
        }
        return binary.toString();
    }

    private String binaryToHex(String binary) {
        StringBuilder hex = new StringBuilder();
        for (int i = 0; i < binary.length(); i += 4) {
            String chunk = binary.substring(i, i + 4);
            int val = Integer.parseInt(chunk, 2);
            hex.append(Integer.toHexString(val).toUpperCase());
        }
        return hex.toString();
    }

    private String applyPermutation(String input, int[] table) {
        StringBuilder output = new StringBuilder();
        for (int position : table) {
            output.append(input.charAt(position - 1));
        }
        return output.toString();
    }

    private String leftShift(String half, int shifts) {
        shifts = shifts % half.length();
        return half.substring(shifts) + half.substring(0, shifts);
    }

    private String xor(String a, String b) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length(); i++) {
            sb.append(a.charAt(i) == b.charAt(i) ? '0' : '1');
        }
        return sb.toString();
    }

    private String[] generateSubKeys(String keyBin) {
        String[] subkeys = new String[16];
        String key56 = applyPermutation(keyBin, PC1);
        String C = key56.substring(0, 28);
        String D = key56.substring(28);

        for (int i = 0; i < 16; i++) {
            C = leftShift(C, SHIFTS[i]);
            D = leftShift(D, SHIFTS[i]);
            subkeys[i] = applyPermutation(C + D, PC2);
        }
        return subkeys;
    }

    private String feistel(String R, String subKey) {
        String expandedR = applyPermutation(R, E);
        String xored = xor(expandedR, subKey);
        StringBuilder substituted = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            String block = xored.substring(i * 6, (i + 1) * 6);
            int row = Integer.parseInt("" + block.charAt(0) + block.charAt(5), 2);
            int col = Integer.parseInt(block.substring(1, 5), 2);
            int val = SBOX[i][row][col];
            String binaryVal = Integer.toBinaryString(val);
            while (binaryVal.length() < 4) binaryVal = "0" + binaryVal;
            substituted.append(binaryVal);
        }
        return applyPermutation(substituted.toString(), P);
    }

    private String processBlock(String blockHex, String keyHex, boolean encrypt) {
        String bin = hexToBinary(blockHex);
        String keyBin = hexToBinary(keyHex);
        
        String permuted = applyPermutation(bin, IP);
        String L = permuted.substring(0, 32);
        String R = permuted.substring(32);
        
        String[] subkeys = generateSubKeys(keyBin);
        
        for (int i = 0; i < 16; i++) {
            String nextR;
            if (encrypt) {
                nextR = xor(L, feistel(R, subkeys[i]));
            } else {
                nextR = xor(L, feistel(R, subkeys[15 - i]));
            }
            L = R;
            R = nextR;
        }
        
        String combined = R + L;
        String finalBin = applyPermutation(combined, FP);
        return binaryToHex(finalBin);
    }

    public String encrypt(String textHex, String keyHex) {
        try {
            if (keyHex.length() != 16) return "Error: Key must be 16 hex characters (64 bits)";
            
            // Padding if not multiple of 16 hex chars
            StringBuilder paddedText = new StringBuilder(textHex);
            while (paddedText.length() % 16 != 0) paddedText.append("0");
            
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < paddedText.length(); i += 16) {
                result.append(processBlock(paddedText.substring(i, i + 16), keyHex, true));
            }
            return result.toString();
        } catch (Exception e) {
            return "Error: Invalid hex input";
        }
    }

    public String decrypt(String textHex, String keyHex) {
        try {
            if (keyHex.length() != 16) return "Error: Key must be 16 hex characters (64 bits)";
            if (textHex.length() % 16 != 0) return "Error: Ciphertext must be multiple of 16 hex chars";
            
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < textHex.length(); i += 16) {
                result.append(processBlock(textHex.substring(i, i + 16), keyHex, false));
            }
            return result.toString();
        } catch (Exception e) {
            return "Error: Invalid hex input";
        }
    }
}
