private static List<string> LoadFields(string fieldsFilePath)
{
    XDocument fieldsDoc = XDocument.Load(fieldsFilePath);
    return fieldsDoc.Descendants("qFieldList")
                    .Elements("qItems")
                    .Elements("qName")
                    .Select(x => x.Value)
                    .ToList();
}

private static List<string> LoadVariables(string variablesFilePath)
{
    XDocument variablesDoc = XDocument.Load(variablesFilePath);
    return variablesDoc.Descendants("qVariableList")
                       .Elements("qItems")
                       .Elements("qName")
                       .Select(x => x.Value)
                       .ToList();
}


            Console.WriteLine($"Flattening XML files for {application}");
            var dumpFiles = Directory.GetFiles(dumpPath);

            // Load fields and variables
            var fields = LoadFields("fields.xml");
            var variables = LoadVariables("variables.xml");

            foreach (var dumpFile in dumpFiles)
            {
                var fileName = Path.GetFileName(dumpFile);
                var extension = Path.GetExtension(dumpFile);
