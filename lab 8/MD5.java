package Security;

public class MD5 {
    // 1. Initialize MD Buffer constants
    private static int A = 0x01234567;
    private static int B = 0x89ABCDEF;
    private static int C = 0xFEDCBA98;
    private static int D = 0x76543210;
    private static final int[] S = {
            7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22, // Round 1
            5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20, // Round 2
            4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23, // Round 3
            6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21  // Round 4
    };

    // 2. Define the four auxiliary functions
    public static int F(int b, int c, int d) {
        return (b & c) | (~b & d);
    }

    public static int G(int b, int c, int d) {
        return (b & d) | (c & ~d);
    }

    public static int H(int b, int c, int d) {
        return b ^ c ^ d;
    }

    public static int I(int b, int c, int d) {
        return c ^ (b | ~d);
    }

    // Circular Left Shift (CLF) function
    private static int CLF(int x, int s) {
        return (x << s) | (x >>> (32 - s));
    }

//    private static final int[] T = new int[65];
//    static {
//        for (int i = 1; i <= 64; i++) {
//            T[i] = (int) (long) (Math.abs(Math.sin(i)) * Math.pow(2, 32));
//            System.out.println(T[i]);
//        }
//    }
    private static final int[] T = {
        0, // Index 0 unused
        // Round 1
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
        0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
        0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        // Round 2
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
        0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
        0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        // Round 3
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
        0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
        0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        // Round 4
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
        0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    };
    // --- Round Functions ---
    private static int[] round1(int[] regs, int[] M) {
        int a = regs[0], b = regs[1], c = regs[2], d = regs[3];
        for (int i = 0; i < 16; i++) {
            int f = F(b,c,d);
            int temp = a + f + M[i] + T[i + 1];
            int rotated = CLF(temp, S[i]);
            a = d;
            d = c;
            c = b;
            b = b + rotated;
        }
        return new int[]{a, b, c, d};
    }
    private static int[] round2(int[] regs, int[] M) {
        int a = regs[0], b = regs[1], c = regs[2], d = regs[3];
        for (int i = 0; i < 16; i++) {
            int k = (1 + 5 * i) % 16; // p2(k) logic
            int temp = a + G(b, c, d) + M[k] + T[i + 17];
            int oldD = d; d = c; c = b;
            b = b + CLF(temp, S[16 + (i % 4)]);
            a = oldD;
        }
        return new int[]{a, b, c, d};
    }

    private static int[] round3(int[] regs, int[] M) {
        int a = regs[0], b = regs[1], c = regs[2], d = regs[3];
        for (int i = 0; i < 16; i++) {
            int k = (5 + 3 * i) % 16; // p3(k) logic
            int temp = a + H(b, c, d) + M[k] + T[i + 33];
            int oldD = d; d = c; c = b;
            b = b + CLF(temp, S[32 + (i % 4)]);
            a = oldD;
        }
        return new int[]{a, b, c, d};
    }

    private static int[] round4(int[] regs, int[] M) {
        int a = regs[0], b = regs[1], c = regs[2], d = regs[3];
        for (int i = 0; i < 16; i++) {
            int k = (7 * i) % 16; // p4(k) logic
            int temp = a + I(b, c, d) + M[k] + T[i + 49];
            int oldD = d; d = c; c = b;
            b = b + CLF(temp, S[48 + (i % 4)]);
            a = oldD;
        }
        return new int[]{a, b, c, d};
    }


    public static String encrypt(String message) {
        byte[] msgBytes = message.getBytes();
        int originalLenBits = msgBytes.length * 8;
        // --- Padding Logic (Step 1 & 2) ---
        int paddingLen = (originalLenBits % 512 < 448) ?
                (448 - (originalLenBits % 512)) / 8 :
                (512 - (originalLenBits % 512) + 448) / 8;
        byte[] paddedMsg = new byte[msgBytes.length + paddingLen + 8];
        System.arraycopy(msgBytes, 0, paddedMsg, 0, msgBytes.length);
        paddedMsg[msgBytes.length] = (byte) 0x80; // The "1" bit
        // Append 64-bit length
        long bits = originalLenBits;
        for (int i = 0; i < 8; i++)
            paddedMsg[paddedMsg.length - 8 + i] = (byte) (bits >>> (i * 8));
        // Process 512-bit blocks
        for (int offset = 0; offset < paddedMsg.length; offset += 64) {
            int[] M = new int[16];
            for (int i = 0; i < 16; i++) {
                M[i] = ((paddedMsg[offset + i * 4] & 0xFF) << 24) |
                        ((paddedMsg[offset + i * 4 + 1] & 0xFF) << 16) |
                        ((paddedMsg[offset + i * 4 + 2] & 0xFF) << 8) |
                        ((paddedMsg[offset + i * 4 + 3] & 0xFF));
            }
            int[] currentRegs = {A, B, C, D};
            // Execute Round Functions
            currentRegs = round1(currentRegs, M);
            currentRegs = round2(currentRegs, M);
            currentRegs = round3(currentRegs, M);
            currentRegs = round4(currentRegs, M);

            // Add back to previous block state
            A += currentRegs[0]; B += currentRegs[1]; C += currentRegs[2]; D += currentRegs[3];
        }

        return String.format("%08x%08x%08x%08x", swap(A), swap(B), swap(C), swap(D));
    }
    private static int swap(int n) {
        return ((n << 24) & 0xff000000) | ((n << 8) & 0x00ff0000) |
                ((n >>> 8) & 0x0000ff00) | (n >>> 24);
    }

    public static void main(String[] args) {
        String message = "cryptography";
        System.out.println("MD5 Hash: " + encrypt(message));
    }
}
