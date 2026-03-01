import java.util.ArrayList;
import java.util.List;
public class Columnar
{
    public static String encrypt(String text,List<Integer> keyOrder)
    {
        text=text.toUpperCase().replaceAll("[^A-Z]", "");
        int cols=keyOrder.size();
        int rows=(int) ( Math.ceil((float) text.length()/cols));
        char[][] matrix =new char[rows][cols];
        int index=0;
        for(int row=0;row<rows;row++)
        {
            for(int col=0;col<cols;col++)
            {
                if(index<text.length()){
                matrix[row][col]=text.charAt(index++);}
                else{matrix[row][col]='X';}
            }
        }
        StringBuilder res=new StringBuilder();
        for(int col=0;col<cols;col++)
        {
            for(int row=0;row<rows;row++)
            {
                int colIndex=keyOrder.indexOf(col);
                res.append(matrix[row][colIndex]);
            }
        }
        return res.toString();

    }
    public static String decrypt(String text, List<Integer> keyOrder)
    {
        text = text.toUpperCase().replaceAll("[^A-Z]", "");
        int cols = keyOrder.size();
        int rows = (int) Math.ceil((double) text.length() / cols);

        char[][] matrix = new char[rows][cols];
        int index = 0;

        for (int col = 0; col < cols; col++)
        {
            int colIndex = keyOrder.indexOf(col);
            for (int row = 0; row < rows; row++)
            {
                if (index < text.length())
                {
                    matrix[row][colIndex] = text.charAt(index++);
                }
            }
        }

        StringBuilder res = new StringBuilder();
        for (int row = 0; row < rows; row++)
        {
            for (int col = 0; col < cols; col++)
            {
                res.append(matrix[row][col]);
            }
        }

        return res.toString();
    }
    public List<Integer> analyse(String plainText, String cipherText) {
        plainText = plainText.replaceAll("[^A-Z]", "").toUpperCase();
        cipherText = cipherText.replaceAll("[^A-Z]", "").toUpperCase();

        for (int cols = 2; cols <= plainText.length(); cols++) {

            int rows = (int) Math.ceil((double) plainText.length() / cols);

            if (rows * cols != cipherText.length())
                continue;

            char[][] matrix = new char[rows][cols];

            int index = 0;
            for (int i = 0; i < rows; i++) {
                for (int j = 0; j < cols; j++) {
                    if (index < plainText.length()) {
                        matrix[i][j] = plainText.charAt(index++);
                    } else {
                        matrix[i][j] = 'X';
                    }
                }
            }

            List<String> columns = new ArrayList<>();

            for (int j = 0; j < cols; j++) {
                StringBuilder col = new StringBuilder();

                for (int i = 0; i < rows; i++) {
                    col.append(matrix[i][j]);
                }

                columns.add(col.toString());
            }

            List<Integer> key = new ArrayList<>();
            boolean[] used = new boolean[cols];

            int pos = 0;
            boolean valid = true;

            for (int order = 1; order <= cols; order++) {

                String part = cipherText.substring(pos, pos + rows);
                pos += rows;

                boolean found = false;

                for (int j = 0; j < cols; j++) {
                    if (!used[j] && columns.get(j).equals(part)) {
                        key.add(j + 1);
                        used[j] = true;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                List<Integer> keyOrder = new ArrayList<>();

                for (int i = 0; i < cols; i++)
                    keyOrder.add(0);

                for (int i = 0; i < key.size(); i++) {
                    keyOrder.set(key.get(i) - 1, i + 1);
                }

                return keyOrder;
            }
        }

        return new ArrayList<>();
    }



public static void main(String[] args)
{
    String text = "HELLO WORLD";

    List<Integer> keyOrder = new ArrayList<>();
    keyOrder.add(2);
    keyOrder.add(0);
    keyOrder.add(3);
    keyOrder.add(1);

    String encrypted = encrypt(text, keyOrder);
    String decrypted = decrypt(encrypted, keyOrder);


    System.out.println("Original:  " + text);
    System.out.println("Key order: " + keyOrder);
    System.out.println("Encrypted: " + encrypted);
    System.out.println("Decrypted: " + decrypted);


}

}