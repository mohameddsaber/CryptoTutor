public class OneTimePad
{
    public static String encrypt(String text,String key)
    {
        StringBuilder res = new StringBuilder();
        text=text.toUpperCase().replaceAll("[^A-Z]", "");
        key=key.toUpperCase().replaceAll("[^A-Z]", "");
        for(int i=0;i<text.length();i++)
        {
            int p=text.charAt(i)-'A';
            int c=key.charAt(i)-'A';

            char ch =(char) ((p+c+26)%26+'A');
            res.append(ch);
        }
        return res.toString();


    }
    public static String invertKey(String key)
{
    key = key.toUpperCase().replaceAll("[^A-Z]", "");
    StringBuilder inv = new StringBuilder();

    for(int i = 0; i < key.length(); i++)
    {
        int k = key.charAt(i) - 'A';
        int newK = (26- k) % 26;
        inv.append((char)(newK + 'A'));
    }

    return inv.toString();
}

    public static String decrypt(String text, String key)
    {
        String invKey=invertKey(key);
        return encrypt(text, invKey);

    }
public static void main(String[] args)
{
    String text = "HELLO";
    String key  = "XMCKL";

    String cipher = encrypt(text, key);

    String decrypted = encrypt(cipher, invertKey(key));

    System.out.println("Plaintext:  " + text);
    System.out.println("Key:        " + key);
    System.out.println("Encrypted:  " + cipher);
    System.out.println("Decrypted:  " + decrypted);
}

}