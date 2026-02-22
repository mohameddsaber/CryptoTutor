
public class PlayfairCipher {
    private final char[][] matrix = new char[5][5];

    public void generateMatrix(String key) {

        String alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

        key = key.toUpperCase()
                 .replaceAll("[^A-Z]", "")
                 .replace("J", "I");

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
    }

    // Prepares the text by removing invalid characters, replacing 'J' with 'I', and ensuring even length
    private String prepareText(String text) {
        text = text.toUpperCase().replaceAll("[^A-Z]", "").replace("J", "I");
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < text.length(); i++) {
            sb.append(text.charAt(i));
            // Insert 'X' if two consecutive letters are the same
            if (i < text.length() - 1 && text.charAt(i) == text.charAt(i + 1) && text.charAt(i) != 'X') {
                sb.append('X');
            }
        }
        // Ensure even length
        if (sb.length() % 2 != 0) {
            sb.append('X');
        }
        return sb.toString();
    }

    private int[] findPosition(char c) {
        for (int row = 0; row < 5; row++) {
            for (int col = 0; col < 5; col++) {
                if (matrix[row][col] == c) {
                    return new int[]{row, col};
                }
            }
        }
        return null; // Should not happen if text is prepared correctly
    }

    // Encrypts the given plaintext using the Playfair cipher algorithm
    public String encrypt(String text) {
        text = prepareText(text);
        StringBuilder encryptedText = new StringBuilder();

        for (int i = 0; i < text.length(); i += 2) {
            char firstChar = text.charAt(i);
            char secondChar = text.charAt(i + 1);
            if(firstChar == 'J') firstChar = 'I';
            if(secondChar == 'J') secondChar = 'I';
            int[] pos1 = findPosition(firstChar);
            int[] pos2 = findPosition(secondChar);

            if (pos1 == null || pos2 == null) continue; // Safety check

            if (pos1[0] == pos2[0]) {  // Same row
                encryptedText.append(matrix[pos1[0]][(pos1[1] + 1) % 5]);
                encryptedText.append(matrix[pos2[0]][(pos2[1] + 1) % 5]);
            } else if (pos1[1] == pos2[1]) {  // Same column
                encryptedText.append(matrix[(pos1[0] + 1) % 5][pos1[1]]);
                encryptedText.append(matrix[(pos2[0] + 1) % 5][pos2[1]]);
            } else {  // Rectangle swap
                encryptedText.append(matrix[pos1[0]][pos2[1]]);
                encryptedText.append(matrix[pos2[0]][pos1[1]]);
            }
        }
        return encryptedText.toString();
    }

    // TODO: Implement this method to decrypt the ciphertext back to plaintext
    public String decrypt(String text) {

    text = text.toUpperCase().replaceAll("[^A-Z]", "");

    StringBuilder decryptedText = new StringBuilder();

    for (int i = 0; i < text.length(); i += 2) {

        char firstChar = text.charAt(i);
        char secondChar = text.charAt(i + 1);

        if (firstChar == 'J') firstChar = 'I';
        if (secondChar == 'J') secondChar = 'I';

        int[] pos1 = findPosition(firstChar);
        int[] pos2 = findPosition(secondChar);

        if (pos1 == null || pos2 == null) continue; // Safety check

        if (pos1[0] == pos2[0]) { // Same row

            decryptedText.append(
                    matrix[pos1[0]][(pos1[1] + 4) % 5]);

            decryptedText.append(
                    matrix[pos2[0]][(pos2[1] + 4) % 5]);

        } else if (pos1[1] == pos2[1]) { // Same column

            decryptedText.append(
                    matrix[(pos1[0] + 4) % 5][pos1[1]]);

            decryptedText.append(
                    matrix[(pos2[0] + 4) % 5][pos2[1]]);

        } else { // Rectangle swap

            decryptedText.append(
                    matrix[pos1[0]][pos2[1]]);

            decryptedText.append(
                    matrix[pos2[0]][pos1[1]]);
        }
    }

    return decryptedText.toString();
}
}
