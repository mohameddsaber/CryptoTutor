
import java.util.Arrays;
import java.util.HashMap;

public class monoalphabetic
{
    public static String encrypt(String text,String key)
    {
        String alphabet="abcdefghijklmnopqrstuvwxyz";
        HashMap map= new HashMap <Character,Character>();
        for(int i=0;i<26;i++)
        {
            map.put(alphabet.charAt(i),key.charAt(i));
        }
        StringBuilder res= new StringBuilder();
        for(char ch:text.toCharArray())
        {
            res.append(map.getOrDefault(ch, ch));

        }
        return res.toString();
    }

    public static String decrypt(String text,String key)
    {
        String alphabet="abcdefghijklmnopqrstuvwxyz";
        HashMap map= new HashMap <Character,Character>();
        for(int i=0;i<26;i++)
        {
            map.put(key.charAt(i),alphabet.charAt(i));
        }
        StringBuilder res= new StringBuilder();
        for(char ch:text.toCharArray())
        {
            res.append(map.getOrDefault(ch, ch));

        }
        return res.toString();


    }

    public String analyseUsingCharFrequency(String cipher) {
        int[] freq = new int[26];
        // Count frequency of letters
        for (char ch : cipher.toLowerCase().toCharArray()) {

            if (Character.isLetter(ch)) {
                freq[ch - 'a']++;
            }
        }

        // Store letters a-z
        Character[] letters = new Character[26];

        for (int i = 0; i < 26; i++) {
            letters[i] = (char) ('a' + i);
        }

        // Sort letters by descending frequency
        Arrays.sort(letters, (a, b) ->
                Integer.compare(freq[b - 'a'], freq[a - 'a']));

        // Convert sorted array to string
        StringBuilder result = new StringBuilder();

        for (char ch : letters) {
            result.append(ch);
        }

        return result.toString();
    }

public static void main(String[] args) 
{
    String key = "qwertyuiopasdfghjklzxcvbnm";
    String text = "hello world";

    String encrypted = encrypt(text, key);
    String decrypted = decrypt(encrypted, key);

    System.out.println("Original:  " + text);
    System.out.println("Encrypted: " + encrypted);
    System.out.println("Decrypted: " + decrypted);
}

}