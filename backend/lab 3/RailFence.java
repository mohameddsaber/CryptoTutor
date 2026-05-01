public class RailFence
{
    public static String encrypt(String text,int depth)
    {
        text=text.toUpperCase().replaceAll("[^A-Z]","");
        int index=0;
        int cols=(int)Math.ceil ((float) text.length()/depth);
        char[][] matrix= new char[depth][cols];
        for(int i=0;i<cols;i++){
            for(int j=0;j<depth;j++){
                if(index<text.length())
                {matrix[j][i]=text.charAt(index++);}
                else
                {
                    matrix[j][i]='X';
                }
            }
        }
        StringBuilder res=new StringBuilder();
        for(int row=0;row<depth;row++)
        {
            for(int col=0;col<cols;col++ )
            {
                res.append(matrix[row][col]);
            }
        }
        return res.toString();


    }
    
    public static String decrypt(String text,int depth)
    {
        int cols=(int) Math.ceil((float) text.length()/depth);
        char[][] matrix =new char[depth][cols];
        int index=0;
        for(int row=0;row<depth;row++)
        {
            for(int col=0;col<cols;col++)
            {
                matrix[row][col]=text.charAt(index++);
            }
        }
        StringBuilder res=new StringBuilder();
        for(int col=0;col<cols;col++)
        {
            for(int row=0;row<depth;row++)
            {
                res.append(matrix[row][col]);
            }
        }
        return res.toString();

    }

    public int analyse(String plainText, String cipherText) {
        plainText = plainText.replaceAll("[^A-Z]", "").toUpperCase();
        cipherText = cipherText.replaceAll("[^A-Z]", "").toUpperCase();

        for (int depth = 2; depth <= plainText.length(); depth++) {

            int length = plainText.length();
            int cols = (int) Math.ceil((double) length / depth);

            if (depth * cols != cipherText.length())
                continue;

            char[][] matrix = new char[depth][cols];

            int index = 0;

            // Fill column by column
            for (int j = 0; j < cols; j++) {
                for (int i = 0; i < depth; i++) {
                    if (index < length) {
                        matrix[i][j] = plainText.charAt(index++);
                    } else {
                        matrix[i][j] = 'X';
                    }
                }
            }

            StringBuilder testCipher = new StringBuilder();

            // Read row by row
            for (int i = 0; i < depth; i++) {
                for (int j = 0; j < cols; j++) {
                    testCipher.append(matrix[i][j]);
                }
            }

            if (testCipher.toString().equals(cipherText)) {
                return depth;
            }
        }

        return -1;
        }
public static void main(String[] args)
{
String text = "computer science";
int depth = 2;

String encrypted = encrypt(text, depth);
String decrypted=decrypt(encrypted, depth);

System.out.println("Original:  " + text);
System.out.println("Depth:     " + depth);
System.out.println("Encrypted: " + encrypted);
System.out.println("Encrypted: " + decrypted);


}


}