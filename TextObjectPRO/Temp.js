private static void MatchFieldsAndVariables(string transformedXmlFolder, List<string> fields, List<string> variables, string outputFilePath)
{
    // Get all transformed XML files from the folder
    var xmlFiles = Directory.GetFiles(transformedXmlFolder, "*.xml");

    using (StreamWriter writer = new StreamWriter(outputFilePath))
    {
        writer.WriteLine("File Name\tField Matches\tVariable Matches");

        foreach (var file in xmlFiles)
        {
            XDocument transformedXml = XDocument.Load(file);
            
            // Extract qsaValues from the transformed XML
            var qsaValues = transformedXml.Descendants("record")
                .Select(e => e.Attribute("qsaValue")?.Value)
                .Where(value => !string.IsNullOrEmpty(value))
                .ToList();

            // Use wildmatch logic to compare qsaValues with fields and variables
            var fieldMatches = fields.Where(field => 
                qsaValues.Any(qsaValue => IsExactOrWildMatch(qsaValue, field))
            ).ToList();

            var variableMatches = variables.Where(variable => 
                qsaValues.Any(qsaValue => IsExactOrWildMatch(qsaValue, variable))
            ).ToList();

            // Write matches to the file
            writer.WriteLine($"{Path.GetFileName(file)}\t{string.Join(", ", fieldMatches)}\t{string.Join(", ", variableMatches)}");
        }
    }
}


MatchFieldsAndVariables(transformedXmlFolder, fields, variables, "matchedValues.txt");
