package com.ciphers.backend.service;

import org.springframework.stereotype.Service;

@Service
public class MD5Service {

    private static final int[] S = {
            7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
            5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
            4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
            6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    };

    private static final int[] T = {
            0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
            0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
            0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
            0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
            0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
            0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
            0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
            0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    };

    public String hash(String message) {
        int a0 = 0x67452301;
        int b0 = 0xefcdab89;
        int c0 = 0x98badcfe;
        int d0 = 0x10325476;

        byte[] msgBytes = message.getBytes();
        int originalLen = msgBytes.length;
        int paddingLen = (56 - (originalLen + 1) % 64 + 64) % 64;
        byte[] paddedMsg = new byte[originalLen + 1 + paddingLen + 8];
        System.arraycopy(msgBytes, 0, paddedMsg, 0, originalLen);
        paddedMsg[originalLen] = (byte) 0x80;

        long bitLen = (long) originalLen * 8;
        for (int i = 0; i < 8; i++) {
            paddedMsg[paddedMsg.length - 8 + i] = (byte) (bitLen >>> (i * 8));
        }

        for (int offset = 0; offset < paddedMsg.length; offset += 64) {
            int[] w = new int[16];
            for (int i = 0; i < 16; i++) {
                w[i] = ((paddedMsg[offset + i * 4 + 3] & 0xFF) << 24) |
                        ((paddedMsg[offset + i * 4 + 2] & 0xFF) << 16) |
                        ((paddedMsg[offset + i * 4 + 1] & 0xFF) << 8) |
                        (paddedMsg[offset + i * 4] & 0xFF);
            }

            int a = a0, b = b0, c = c0, d = d0;

            for (int i = 0; i < 64; i++) {
                int f, g;
                if (i < 16) {
                    f = (b & c) | (~b & d);
                    g = i;
                } else if (i < 32) {
                    f = (d & b) | (~d & c);
                    g = (5 * i + 1) % 16;
                } else if (i < 48) {
                    f = b ^ c ^ d;
                    g = (3 * i + 5) % 16;
                } else {
                    f = c ^ (b | ~d);
                    g = (7 * i) % 16;
                }
                int temp = d;
                d = c;
                c = b;
                b = b + Integer.rotateLeft(a + f + T[i] + w[g], S[i]);
                a = temp;
            }

            a0 += a;
            b0 += b;
            c0 += c;
            d0 += d;
        }

        return String.format("%08x%08x%08x%08x", swap(a0), swap(b0), swap(c0), swap(d0));
    }

    private int swap(int n) {
        return Integer.reverseBytes(n);
    }
}
