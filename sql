DECLARE @tableName NVARCHAR(100) = 'YourTable'

DECLARE @cols NVARCHAR(MAX) = STUFF((
        SELECT ',' + 
        CASE WHEN RIGHT(COLUMN_NAME, 4) = 'Date' AND TRY_CAST('[' + COLUMN_NAME + '] AS DATE) IS NULL 
            THEN 'TRY_CAST([' + COLUMN_NAME + '] AS DATE) AS [' + COLUMN_NAME + ']'
            ELSE '[' + COLUMN_NAME + ']' END
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'dbo' 
        AND TABLE_NAME = @tableName 
        FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '')

DECLARE @sql NVARCHAR(MAX) = 'SELECT ' + @cols + ' FROM ' + @tableName

EXEC sp_executesql @sql
