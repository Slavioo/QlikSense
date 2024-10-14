private static void ProcessXmlFilesInBulk(string transformFolderPath, List<string> fields, List<string> variables, string outputFilePath)
{
    var xmlFiles = Directory.GetFiles(transformFolderPath, "*.xml");

    // Load all XML documents in parallel
    var loadedXmlDocuments = xmlFiles
        .AsParallel()
        .Select(file => new { FilePath = file, Document = XDocument.Load(file) })
        .ToList();

    // Select and flatten all qsaValue records from all loaded documents at once
    var allRecords = loadedXmlDocuments
        .SelectMany(xmlData =>
            xmlData.Document.Descendants("record")
            .Where(e => e.Attribute("qsaValue") != null)
            .Select(e => new
            {
                FilePath = xmlData.FilePath,
                Element = e,
                qsaValue = e.Attribute("qsaValue")?.Value
            })
        )
        .ToList();

    // Process all records and match against fields/variables
    var matchedResults = allRecords
        .AsParallel()
        .Select(record =>
        {
            string fieldMatch = string.Join("|", fields.Where(field => IsExactOrWildMatch(record.qsaValue, field)));
            string variableMatch = string.Join("|", variables.Where(variable => IsExactOrWildMatch(record.qsaValue, variable)));

            return new XElement("record",
                new XAttribute("FilePath", Path.GetFileName(record.FilePath)),
                record.Element.Attributes(), // Retain original attributes
                new XAttribute("qsaFieldMatch", string.IsNullOrEmpty(fieldMatch) ? "N/A" : fieldMatch),
                new XAttribute("qsaVariableMatch", string.IsNullOrEmpty(variableMatch) ? "N/A" : variableMatch)
            );
        })
        .ToList();

    // Create a new XML output document with all the matched records
    XDocument outputXml = new XDocument(
        new XElement("MatchedRecords", matchedResults)
    );

    // Save the output XML document
    outputXml.Save(outputFilePath);
}




List<string> fields = LoadFields(fieldsFilePath);
List<string> variables = LoadVariables(variablesFilePath);

string transformFolderPath = @"path\to\transform\folder";
string outputFilePath = @"path\to\output\file.xml";

ProcessXmlFilesInBulk(transformFolderPath, fields, variables, outputFilePath);
