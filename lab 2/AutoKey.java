
public class AutoKey {
    public String analyse(String plainText, String cipherText) {
    plainText = plainText.toUpperCase().replaceAll("[^A-Z]", "");
    cipherText = cipherText.toUpperCase().replaceAll("[^A-Z]", "");

    StringBuilder generatedKey = new StringBuilder();

    for (int i = 0; i < plainText.length(); i++) {

        int p = plainText.charAt(i) - 'A';
        int c = cipherText.charAt(i) - 'A';

        int k = (c - p + 26) % 26;

        generatedKey.append((char)(k + 'A'));
    }

    for (int len = 1; len <= plainText.length(); len++) {

        boolean valid = true;

        for (int i = len; i < plainText.length(); i++) {

            char expected = plainText.charAt(i - len);

            if (generatedKey.charAt(i) != expected) {
                valid = false;
                break;
            }
        }

        if (valid) {
            return generatedKey.substring(0, len);
        }
    }

    return generatedKey.toString();
}

    public static String decrypt(String cipherText, String key) {

    cipherText = cipherText.toUpperCase().replaceAll("[^A-Z]", "");
    key = key.toUpperCase().replaceAll("[^A-Z]", "");

    StringBuilder plaintext = new StringBuilder();
    StringBuilder currentKey = new StringBuilder(key);

    for (int i = 0; i < cipherText.length(); i++) {

        int c = cipherText.charAt(i) - 'A';
        int k = currentKey.charAt(i) - 'A';

        int p = (c - k + 26) % 26;

        char plainChar = (char)(p + 'A');
        plaintext.append(plainChar);

        currentKey.append(plainChar);
    }


    return plaintext.toString();
}

    public static String encrypt(String plainText, String key) {

    plainText = plainText.toUpperCase().replaceAll("[^A-Z]", "");
    key = key.toUpperCase().replaceAll("[^A-Z]", "");

    StringBuilder ciphertext = new StringBuilder();

    StringBuilder fullKey = new StringBuilder(key);
    fullKey.append(plainText);
    for (int i = 0; i < plainText.length(); i++) {

        int p = plainText.charAt(i) - 'A';
        int k = fullKey.charAt(i) - 'A';

        int c = (p + k) % 26;

        ciphertext.append((char) (c + 'A'));
    }

    return ciphertext.toString();
}
}
