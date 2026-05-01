package Security;

import java.util.List;

public class DiffieHellman {
    public List<Long> getKeys(long q, long alpha, long xa, long xb) {
        long Ya = modPow(alpha, xa, q);
        long Yb = modPow(alpha, xb, q);
        long Ka = modPow(Yb, xa, q);
        long Kb = modPow(Ya, xb, q);
        return List.of(Ka, Kb);
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
}
