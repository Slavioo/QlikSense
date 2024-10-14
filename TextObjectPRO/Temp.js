private static void AddFieldAndVariableMatchesToXmlFiles(string transformFolder, List<string> fields, List<string> variables)
{
    var xmlFiles = Directory.GetFiles(transformFolder, "*.xml");

    foreach (var xmlFile in xmlFiles)
    {
        // Load the XML document
        XDocument xmlDoc = XDocument.Load(xmlFile);
        
        // Loop through all 'record' elements in the XML
        foreach (var record in xmlDoc.Descendants("record"))
        {
            var qsaValue = record.Attribute("qsaValue")?.Value;

            if (!string.IsNullOrEmpty(qsaValue))
            {
                // Apply wildmatch logic for fields and variables
                string fieldMatch = string.Join("|", fields.Where(field => IsExactOrWildMatch(qsaValue, field)));
                string variableMatch = string.Join("|", variables.Where(variable => IsExactOrWildMatch(qsaValue, variable)));

                // Add matches as new attributes if they exist
                if (!string.IsNullOrEmpty(fieldMatch))
                {
                    record.SetAttributeValue("qsaFieldMatch", fieldMatch);
                }

                if (!string.IsNullOrEmpty(variableMatch))
                {
                    record.SetAttributeValue("qsaVariableMatch", variableMatch);
                }
            }
        }

        // Save the updated XML document back to the file
        xmlDoc.Save(xmlFile);
    }
}

private static bool IsExactOrWildMatch(string xmlValue, string searchValue)
{
    if (xmlValue == searchValue)
    {
        return true;
    }

    // Adjust the pattern to match wildcards or special characters
    string pattern = $@"[\[\]{{}}()<>,=]\s*{System.Text.RegularExpressions.Regex.Escape(searchValue)}\s*[\[\]{{}}()<>,=]";
    return System.Text.RegularExpressions.Regex.IsMatch(xmlValue, pattern);
}
