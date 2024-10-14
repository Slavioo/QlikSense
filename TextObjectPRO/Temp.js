private static void MatchFieldsAndVariables(string transformedXmlFolder, List<string> fields, List<string> variables, string outputFilePath)
{
    // Get all transformed XML files from the folder
    var xmlFiles = Directory.GetFiles(transformedXmlFolder, "*.xml");

    using (StreamWriter writer = new StreamWriter(outputFilePath))
    {
        // Write the header for the output file
        writer.WriteLine("File Name\tField Matches (qsaId: qsaValue)\tVariable Matches (qsaId: qsaValue)");

        foreach (var file in xmlFiles)
        {
            XDocument transformedXml = XDocument.Load(file);
            
            // Extract qsaId and qsaValue pairs from the transformed XML
            var qsaIdValuePairs = transformedXml.Descendants("record")
                .Select(e => new
                {
                    qsaId = e.Attribute("qsaId")?.Value,
                    qsaValue = e.Attribute("qsaValue")?.Value
                })
                .Where(pair => !string.IsNullOrEmpty(pair.qsaValue))
                .ToList();

            // Use wildmatch logic to compare qsaValues with fields and variables, including corresponding qsaId
            var fieldMatches = qsaIdValuePairs
                .Where(pair => fields.Any(field => IsExactOrWildMatch(pair.qsaValue, field)))
                .Select(match => $"{match.qsaId}: {match.qsaValue}")
                .ToList();

            var variableMatches = qsaIdValuePairs
                .Where(pair => variables.Any(variable => IsExactOrWildMatch(pair.qsaValue, variable)))
                .Select(match => $"{match.qsaId}: {match.qsaValue}")
                .ToList();

            // Write matches to the file
            writer.WriteLine($"{Path.GetFileName(file)}\t{string.Join(", ", fieldMatches)}\t{string.Join(", ", variableMatches)}");
        }
    }
}
