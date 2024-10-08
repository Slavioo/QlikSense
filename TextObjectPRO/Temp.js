private static async Task Main()
{
    int warningCounter = 0;

    QsAnalyzerConfig config;
    using (var r = new StreamReader("QlikSenseAnalyzerSettings.json"))
    {
        var settings = r.ReadToEnd();
        config = JsonConvert.DeserializeObject<QsAnalyzerConfig>(settings);
    }

    var applicationsToAnalyze = GetApplicationsForAnalysis(config.InputFolder);
    var thereAreApplicationsToAnalyze = applicationsToAnalyze.Length > 0;

    if (!thereAreApplicationsToAnalyze)
    {
        Console.WriteLine($"There are no apps in the {config.InputFolder} folder to be analyzed");
        return;
    }

    var qsImportClient = new QsRestClientFactory(config.Server).Client;

    using var location = ConnectHub(config.Server, config.Timeout);
    {
        // Create a list to hold the tasks
        var tasks = new List<Task>();

        foreach (var application in applicationsToAnalyze)
        {
            // Start a new task for each application
            tasks.Add(Task.Run(() => ProcessApplication(application, qsImportClient, config, location, ref warningCounter)));
        }

        // Wait for all tasks to complete
        await Task.WhenAll(tasks);
    }

    Console.WriteLine(warningCounter == 0
        ? "The export and flattening of xml files is done. You can close the window"
        : $"Warning! {warningCounter} warnings have been written to the console. Please close the window, and try running the application again.");

    Console.ReadLine();
}

// This method processes a single application
private static void ProcessApplication(string application, QsRestClient qsImportClient, QsAnalyzerConfig config, object location, ref int warningCounter)
{
    Console.WriteLine($"Importing {application}");
    var importedAppId = ImportApp(application, qsImportClient);
    Console.WriteLine($"Importing of {application} is finished");

    var outputPath = Path.Combine(Directory.GetCurrentDirectory(), config.OutputFolder, Path.GetFileName(application));
    var dumpPath = Path.Combine(Directory.GetCurrentDirectory(), config.OutputFolder, Path.GetFileName(application), "Extract");
    var transformPath = Path.Combine(Directory.GetCurrentDirectory(), config.OutputFolder, Path.GetFileName(application), "Transform");

    var transformPathForXml = Path.Combine(transformPath, "XML");
    var transformPathForTxt = Path.Combine(transformPath, "TXT");

    try
    {
        Directory.Delete(outputPath, true);
    }
    catch
    {
        Console.WriteLine("There is no output folder for the dashboard yet and it will be created");
    }

    Directory.CreateDirectory(dumpPath);
    Directory.CreateDirectory(transformPath);
    Directory.CreateDirectory(transformPathForXml);
    Directory.CreateDirectory(transformPathForTxt);

    Console.WriteLine($"Exporting {application}");
    var appId = GetApplicationId(importedAppId, location);
    var app = location.App(appId);

    ExportMasterItems(app, dumpPath, config.ExcludedTags);
    ExportObjects(app, dumpPath, config.Visualisations, config.ExcludedTags);
    location.Delete(appId);

    Console.WriteLine($"Exporting of {application} is finished");
    Console.WriteLine($"Flattening xml files for {application}");

    var dumpFiles = Directory.GetFiles(dumpPath);
    foreach (var dumpFile in dumpFiles)
    {
        var fileName = Path.GetFileName(dumpFile);
        var extension = Path.GetExtension(dumpFile);

        if (string.Equals(extension, ".txt", StringComparison.OrdinalIgnoreCase))
        {
            var outputFile = Path.Combine(transformPathForTxt, $"{fileName}");
            File.Copy(dumpFile, outputFile, true);
        }
        else if (string.Equals(extension, ".xml", StringComparison.OrdinalIgnoreCase))
        {
            var outputFile = Path.Combine(transformPathForXml, $"{fileName}");
            XDocument outputXml = new XDocument(new XElement("data"));
            XElement xml = XElement.Load(dumpFile);
            var hierarchicalIdRootLevel = "1";
            var emptyInitialPath = "";

            FlattenXml(xml, hierarchicalIdRootLevel, emptyInitialPath, outputXml.Root);
            outputXml.Save(outputFile);
        }
    }

    int dumpPathXmlCount = Directory.GetFiles(dumpPath, "*.xml").Length;
    int transformPathXmlCount = Directory.GetFiles(transformPathForXml, "*.xml").Length;
    int dumpPathTxtCount = Directory.GetFiles(dumpPath, "*.txt").Length;
    int transformPathTxtCount = Directory.GetFiles(transformPathForTxt, "*.txt").Length;

    Console.WriteLine($"{dumpPathXmlCount} XML files in the Extract Folder");
    Console.WriteLine($"{transformPathXmlCount} XML files in the Transform Folder");
    Console.WriteLine($"{dumpPathTxtCount} TXT files in the Extract Folder");
    Console.WriteLine($"{transformPathTxtCount} TXT files in the Transform Folder");

    if (dumpPathXmlCount == transformPathXmlCount)
    {
        Console.WriteLine($"Flattening of xml files for {application} is finished");
    }
    else
    {
        Console.WriteLine($"Warning: the number of xml files for {application} in the Transform folder is not the same as in the Extract Folder.");
        warningCounter++;
    }

    if (dumpPathTxtCount == transformPathTxtCount)
    {
        Console.WriteLine($"Copying of TXT files for {application} is finished");
    }
    else
    {
        Console.Error.WriteLine($"Warning: the number of TXT files for {application} in the Transform folder is not the same as in the Extract Folder.");
        warningCounter++;
    }
}
