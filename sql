DECLARE @table NVARCHAR(100) = 'abc'

DECLARE @cols NVARCHAR(MAX) = (SELECT STRING_AGG(
    CASE WHEN RIGHT(COLUMN_NAME, 4) = 'Date' THEN 'CONVERT(DATE, [' + COLUMN_NAME + '], 23) AS [' + COLUMN_NAME + ']'
        ELSE '[' + COLUMN_NAME + ']' END, ',') FROM information_schema.columns
    WHERE table_schema = 'def' AND table_name = @table)

DECLARE @sql NVARCHAR(MAX) = 'SELECT ' + @cols + ' FROM ' + @table

EXEC(@sql)
