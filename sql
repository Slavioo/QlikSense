DECLARE @cols NVARCHAR(MAX) = (SELECT STRING_AGG(
    CASE WHEN RIGHT(name, 4) = 'Date' AND TRY_CAST('[' + name + ']' AS DATE) IS NULL 
        THEN 'TRY_CAST([' + name + '] AS DATE) AS [' + name + ']'
        ELSE '[' + name + ']' END, ',') FROM sys.columns WHERE object_id = OBJECT_ID('YourTable'))

DECLARE @sql NVARCHAR(MAX) = 'SELECT ' + @cols + ' INTO #tempTable FROM YourTable'

EXEC (@sql)

SELECT * FROM #tempTable

DROP TABLE #tempTable
