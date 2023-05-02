WITH SQL AS (
    -- your original query here
    SELECT column1, column2, column3Date, column4, column5Date
    FROM YourTable
)

SELECT 
    CASE 
        WHEN c.DATA_TYPE = 'varchar' AND c.COLUMN_NAME LIKE '%Date' AND TRY_CAST(c.COLUMN_NAME AS DATE) IS NOT NULL 
        THEN TRY_CAST(c.COLUMN_NAME AS DATE) 
        ELSE t.COLUMN_NAME 
    END AS COLUMN_NAME 
FROM SQL t
INNER JOIN INFORMATION_SCHEMA.COLUMNS c 
    ON c.TABLE_NAME = 'SQL' 
    AND c.COLUMN_NAME = t.COLUMN_NAME 
ORDER BY (SELECT NULL)
