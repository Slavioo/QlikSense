private static async Task Main()
{
    int warningCounter = 0;
    const int maxConcurrentRequests = 4; // Number of concurrent requests
    const int delayBetweenRequests = 1000; // Delay in milliseconds

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

    ILocation location; 
    using (location = ConnectHub(config.Server, config.Timeout))
    {
        var tasks = new List<Task>();
        using (var semaphore = new SemaphoreSlim(maxConcurrentRequests))
        {
            foreach (var application in applicationsToAnalyze)
            {
                await semaphore.WaitAsync(); // Wait until a spot is free

                tasks.Add(Task.Run(async () =>
                {
                    try
                    {
                        await ProcessApplication(application, qsImportClient, config, location, ref warningCounter);
                    }
                    finally
                    {
                        await Task.Delay(delayBetweenRequests); // Add a delay between requests
                        semaphore.Release(); // Release the spot when done
                    }
                }));
            }

            await Task.WhenAll(tasks);
        }
    }

    Console.WriteLine(warningCounter == 0
        ? "The export and flattening of xml files is done. You can close the window"
        : $"Warning! {warningCounter} warnings have been written to the console. Please close the window, and try running the application again.");

    Console.ReadLine();
}




private static async Task<int> ProcessApplication(
    string application, 
    Qlik.Sense.RestClient.RestClient qsImportClient, 
    QsAnalyzerConfig config, 
    ILocation location)
{
    int warningCounter = 0; // Local warning counter

    Console.WriteLine($"Importing {application}");

    // Import the application
    var importedAppId = ImportApp(application, qsImportClient);

    Console.WriteLine($"Importing of {application} is finished");

    var outputPath = Path.Combine(Directory.GetCurrentDirectory(), config.OutputFolder, Path.GetFileName(application));
    var dumpPath = Path.Combine(outputPath, "Extract");
    var transformPath = Path.Combine(outputPath, "Transform");
    var transformPathForXml = Path.Combine(transformPath, "XML");
    var transformPathForTxt = Path.Combine(transformPath, "TXT");

    // Handle directories
    try
    {
        Directory.Delete(outputPath, true);
    }
    catch
    {
        Console.WriteLine("There is no output folder for the dashboard yet, and it will be created");
    }

    Directory.CreateDirectory(dumpPath);
    Directory.CreateDirectory(transformPath);
    Directory.CreateDirectory(transformPathForXml);
    Directory.CreateDirectory(transformPathForTxt);

    Console.WriteLine($"Exporting {application}");

    // Get Application ID and App object from Qlik Sense location
    var appId = GetApplicationId(importedAppId, location);
    var app = location.App(appId);

    // Export data from the app
    ExportMasterItems(app, dumpPath, config.ExcludedTags);
    ExportObjects(app, dumpPath, config.Visualisations, config.ExcludedTags);

    // Delete app after export
    location.Delete(appId);

    Console.WriteLine($"Exporting of {application} is finished");

    // Flattening XML files
    Console.WriteLine($"Flattening XML files for {application}");
    var dumpFiles = Directory.GetFiles(dumpPath);

    foreach (var dumpFile in dumpFiles)
    {
        var fileName = Path.GetFileName(dumpFile);
        var extension = Path.GetExtension(dumpFile);

        if (string.Equals(extension, ".txt", StringComparison.OrdinalIgnoreCase))
        {
            var outputFile = Path.Combine(transformPathForTxt, fileName);
            File.Copy(dumpFile, outputFile, true);
        }
        else if (string.Equals(extension, ".xml", StringComparison.OrdinalIgnoreCase))
        {
            var outputFile = Path.Combine(transformPathForXml, fileName);
            XDocument outputXml = new XDocument(new XElement("data"));
            XElement xml = XElement.Load(dumpFile);

            // Flatten XML
            var hierarchicalIdRootLevel = "1";
            var emptyInitialPath = "";
            FlattenXml(xml, hierarchicalIdRootLevel, emptyInitialPath, outputXml.Root);
            outputXml.Save(outputFile);
        }
    }

    // Count XML and TXT files
    int dumpPathXmlCount = Directory.GetFiles(dumpPath, "*.xml").Length;
    int transformPathXmlCount = Directory.GetFiles(transformPathForXml, "*.xml").Length;
    int dumpPathTxtCount = Directory.GetFiles(dumpPath, "*.txt").Length;
    int transformPathTxtCount = Directory.GetFiles(transformPathForTxt, "*.txt").Length;

    Console.WriteLine($"{dumpPathXmlCount} XML files in the Extract Folder");
    Console.WriteLine($"{transformPathXmlCount} XML files in the Transform Folder");
    Console.WriteLine($"{dumpPathTxtCount} TXT files in the Extract Folder");
    Console.WriteLine($"{transformPathTxtCount} TXT files in the Transform Folder");

    // Validate file counts and handle warnings
    if (dumpPathXmlCount != transformPathXmlCount)
    {
        Console.WriteLine($"Warning: XML files mismatch for {application}. Extract and Transform counts differ.");
        warningCounter++;
    }
    else
    {
        Console.WriteLine($"Flattening of XML files for {application} is finished.");
    }

    if (dumpPathTxtCount != transformPathTxtCount)
    {
        Console.WriteLine($"Warning: TXT files mismatch for {application}. Extract and Transform counts differ.");
        warningCounter++;
    }
    else
    {
        Console.WriteLine($"Copying of TXT files for {application} is finished.");
    }

    return warningCounter; // Return number of warnings
}

