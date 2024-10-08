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
