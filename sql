DECLARE @sql NVARCHAR(MAX) = '
WITH SQL AS (
  -- your original query here
  SELECT *
  FROM YourTable
)
SELECT
  ' + STRING_AGG(
    CASE WHEN RIGHT(COLUMN_NAME, 4) = 'Date' AND DATA_TYPE <> 'DATE'
      THEN 'TRY_CAST([' + COLUMN_NAME + '] AS DATE) AS [' + COLUMN_NAME + ']'
      ELSE '[' + COLUMN_NAME + ']' END,
    ',') WITHIN GROUP (ORDER BY ORDINAL_POSITION) + '
FROM SQL
'

EXEC sp_executesql @sql
