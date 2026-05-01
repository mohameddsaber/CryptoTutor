package Security;

public class RSA {
    public Long encrypt(long m, long e, long n) {
        long C = modPow(m, e, n);
        return C;
    }
    public Long decrypt(long c, long e, long n) {
        long d = calculateInverse(e, n);
        long m = modPow(c, d, n);
        return m;
    }
    public static long modPow(long base, long exp, long mod) {
        long result = 1;
        base = base % mod;

        while (exp > 0) {
            if ((exp & 1) == 1) {
                result = (result * base) % mod;
            }
            exp >>= 1;
            base = (base * base) % mod;
        }
        return result;
    }
    private static long calculateInverse(long base, long mod) {

    long A1 = 1, A2 = 0, A3 = mod;
    long B1 = 0, B2 = 1, B3 = base;

    while (B3 != 0 && B3 != 1) {

        long Q = A3 / B3;

        // Calculate new B values
        long newB1 = A1 - (Q * B1);
        long newB2 = A2 - (Q * B2);
        long newB3 = A3 - (Q * B3);

        // Shift A values to old B values
        A1 = B1;
        A2 = B2;
        A3 = B3;

        // Update B values
        B1 = newB1;
        B2 = newB2;
        B3 = newB3;
    }

    long inverse = B2;

    if (inverse < 0) {
        inverse += mod;
    }

    return inverse;
}
}
