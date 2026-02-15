public class caeser 
{
    public static String encrypt(String message, int key)
    {
        StringBuilder res= new StringBuilder();
        for(char ch:message.toCharArray())
        {
            if(Character.isLetter(ch)){
            char base=Character.isUpperCase(ch) ? 'A' : 'a';
            char encC= (char) ((ch-base+(key%26) +26)%26 +base);
            res.append(encC);
            }
            else
            {
                res.append(ch);
            }
        }
        return res.toString();

    }
    public static String decrypt(String message,int key)
    {
        return encrypt(message,-key);
    }
        public int analyse(String plainText, String cipherText) {
        // Convert first characters to lowercase
        char p = Character.toLowerCase(plainText.charAt(0));
        char c = Character.toLowerCase(cipherText.charAt(0));

        // Calculate key
        int key = (c - p + 26) % 26;

        return key;
    }

    public static void main(String[] args) 
    { String message = "Hello, World!"; 
    int key = 3; 
    String encrypted = encrypt(message, key); 
    String decrypted = decrypt(encrypted, key); 
    System.out.println("Original: " + message); 
    System.out.println("Encrypted: " + encrypted); 
    System.out.println("Decrypted: " + decrypted); }
}