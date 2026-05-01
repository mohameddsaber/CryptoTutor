
public class RepeatingKey {
    public String analyse(String plainText, String cipherText) {
        plainText = plainText.toUpperCase().replaceAll("[^A-Z]", "");
    cipherText = cipherText.toUpperCase().replaceAll("[^A-Z]", "");

    if (plainText.length() != cipherText.length()) {
        throw new IllegalArgumentException("Plaintext and Ciphertext must have same length.");
    }

    StringBuilder fullKey = new StringBuilder();

    for (int i = 0; i < plainText.length(); i++) {

        int p = plainText.charAt(i) - 'A';
        int c = cipherText.charAt(i) - 'A';

        int k = (c - p + 26) % 26;

        fullKey.append((char)(k + 'A'));
    }

    String keyString = fullKey.toString();

    for (int len = 1; len <= keyString.length(); len++) {

        if (keyString.length() % len == 0) {

            String candidate = keyString.substring(0, len);

            StringBuilder repeated = new StringBuilder();

            for (int i = 0; i < keyString.length() / len; i++) {
                repeated.append(candidate);
            }

            if (repeated.toString().equals(keyString)) {
                return candidate;
            }
        }
    }

    return keyString;
    }

    public String decrypt(String cipherText, String key) {
        cipherText = cipherText.toUpperCase().replaceAll("[^A-Z]", "");
    key = key.toUpperCase().replaceAll("[^A-Z]", "");

    StringBuilder plaintext = new StringBuilder();

    for (int i = 0; i < cipherText.length(); i++) {

        int c = cipherText.charAt(i) - 'A';
        int k = key.charAt(i % key.length()) - 'A';

        int p = (c - k + 26) % 26;

        plaintext.append((char) (p + 'A'));
    }

    return plaintext.toString();
    }

    public String encrypt(String plainText, String key) {
        plainText = plainText.toUpperCase().replaceAll("[^A-Z]", "");
    key = key.toUpperCase().replaceAll("[^A-Z]", "");

    StringBuilder ciphertext = new StringBuilder();

    for (int i = 0; i < plainText.length(); i++) {

        int p = plainText.charAt(i) - 'A';
        int k = key.charAt(i % key.length()) - 'A';

        int c = (p + k) % 26;

        ciphertext.append((char) (c + 'A'));
    }

    return ciphertext.toString();
    }
}
