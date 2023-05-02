WITH SQL AS (
    -- your original query here
    SELECT column1, column2, column3Date, column4, column5Date
    FROM YourTable
)
SELECT 
    CASE 
        WHEN c.DATA_TYPE = 'varchar' AND c.COLUMN_NAME LIKE '%Date' AND 
             c.CHARACTER_MAXIMUM_LENGTH = 10 AND TRY_CAST(t.COLUMN_NAME AS DATE) IS NOT NULL 
        THEN TRY_CAST(t.COLUMN_NAME AS DATE) 
        ELSE t.COLUMN_NAME 
    END AS COLUMN_NAME 
FROM SQL t, 
     tempdb.INFORMATION_SCHEMA.COLUMNS c 
WHERE c.TABLE_NAME = 'SQL' 
  AND c.COLUMN_NAME = t.COLUMN_NAME 
ORDER BY (SELECT NULL)
