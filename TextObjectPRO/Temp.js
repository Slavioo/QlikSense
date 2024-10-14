private static void CompareAndSaveToXml(string transformFolderPath, string outputXmlPath, List<string> fields, List<string> variables)
{
    XElement rootElement = new XElement("Matches"); // Root for the output XML

    // Process each transformed XML file
    foreach (var filePath in Directory.GetFiles(transformFolderPath, "*.xml"))
    {
        // Load the transformed XML file
        XDocument doc = XDocument.Load(filePath);

        // Iterate through each record element
        foreach (var record in doc.Descendants("record"))
        {
            var qsaValue = record.Attribute("qsaValue")?.Value;

            if (!string.IsNullOrEmpty(qsaValue))
            {
                // Find matches for fields and variables using the wildmatch logic
                string fieldMatch = string.Join("|", fields.Where(field => IsExactOrWildMatch(qsaValue, field)));
                string variableMatch = string.Join("|", variables.Where(variable => IsExactOrWildMatch(qsaValue, variable)));

                // Only add matched records to the output
                if (!string.IsNullOrEmpty(fieldMatch) || !string.IsNullOrEmpty(variableMatch))
                {
                    // Clone the matched record element
                    XElement matchedRecord = new XElement(record);

                    // Add file name attribute to the matched record
                    matchedRecord.Add(new XAttribute("fileName", Path.GetFileName(filePath)));

                    // Add the field and variable matches as attributes if they exist
                    if (!string.IsNullOrEmpty(fieldMatch))
                    {
                        matchedRecord.Add(new XAttribute("qsaFieldMatch", fieldMatch));
                    }
                    if (!string.IsNullOrEmpty(variableMatch))
                    {
                        matchedRecord.Add(new XAttribute("qsaVariableMatch", variableMatch));
                    }

                    // Add the matched record to the root element
                    rootElement.Add(matchedRecord);
                }
            }
        }
    }

    // Save all matched records into a single output XML file
    XDocument outputDoc = new XDocument(rootElement);
    outputDoc.Save(outputXmlPath);

    Console.WriteLine("Matching values have been saved to XML successfully.");
}

private static bool IsExactOrWildMatch(string xmlValue, string searchValue)
{
    if (xmlValue == searchValue)
    {
        return true;
    }

    string pattern = $@"[\[\]{{}}()<>,=]\s*{System.Text.RegularExpressions.Regex.Escape(searchValue)}\s*[\[\]{{}}()<>,=]";
    return System.Text.RegularExpressions.Regex.IsMatch(xmlValue, pattern);
}
