using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using Newtonsoft.Json;
using Qlik.Engine;
using Qlik.Sense.Client;
using Qlik.Sense.JsonRpc;
using Qlik.Sense.RestClient;
using ILocation = Qlik.Engine.ILocation;
using Location = Qlik.Engine.Location;

namespace QlikSenseAnalyzer
{
    internal static class Program
    {
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

            if (applicationsToAnalyze.Length == 0)
            {
                Console.WriteLine($"There are no apps in the {config.InputFolder} folder to be analyzed");
                return;
            }

            // qsClient server to import app, location server - to get metadata
            var qsImportClient = new QsRestClientFactory(config.Server).Client;

            using var location = ConnectHub(config.Server, config.Timeout);
            var tasks = applicationsToAnalyze.Select(application => ProcessApplication(application, qsImportClient, location, config)).ToArray();

            await Task.WhenAll(tasks);

            Console.WriteLine(warningCounter == 0
                ? "The export and flattening of xml files is done. You can close the window"
                : $"Warning! {warningCounter} warnings have been written to the console. Please close the window, and try running the application again.");

            Console.ReadLine();
        }

        private static async Task ProcessApplication(string application, IRestClient qsClient, ILocation location, QsAnalyzerConfig config)
        {
            Console.WriteLine($"Importing {application}");

            var importedAppId = ImportApp(application, qsClient);

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
            await FlattenAndExportFiles(dumpPath, transformPathForXml, transformPathForTxt);

            Console.WriteLine($"Flattening of xml files for {application} is finished");
        }

        private static async Task FlattenAndExportFiles(string dumpPath, string transformPathForXml, string transformPathForTxt)
        {
            var dumpFiles = Directory.GetFiles(dumpPath);

            var tasks = dumpFiles.Select(dumpFile =>
            {
                var fileName = Path.GetFileName(dumpFile);
                var extension = Path.GetExtension(dumpFile);
                return extension switch
                {
                    ".txt" => Task.Run(() =>
                    {
                        var outputFile = Path.Combine(transformPathForTxt, fileName);
                        File.Copy(dumpFile, outputFile, true);
                    }),
                    ".xml" => Task.Run(() =>
                    {
                        var outputFile = Path.Combine(transformPathForXml, fileName);
                        XDocument outputXml = new XDocument(new XElement("data"));
                        XElement xml = XElement.Load(dumpFile);

                        var hierarchicalIdRootLevel = "1";
                        var emptyInitialPath = "";
                        FlattenXml(xml, hierarchicalIdRootLevel, emptyInitialPath, outputXml.Root);
                        outputXml.Save(outputFile);
                    }),
                    _ => Task.CompletedTask
                };
            });

            await Task.WhenAll(tasks);
        }

        private static string[] GetApplicationsForAnalysis(string folder)
        {
            return Directory.GetFiles(folder, "*.qvf");
        }

        private static string ImportApp(string application, IRestClient qsClient)
        {
            var applicationUniqueName = Guid.NewGuid().ToString("N");
            var data = File.ReadAllBytes(application);
            var qsResult = qsClient.WithContentType("application/vnd.qlik.sense.app")
                .Post("/qrs/app/upload?keepData=true&name=" + applicationUniqueName, data);
            var qsResponse = JsonConvert.DeserializeObject<QsResponse>(qsResult);
            return qsResponse.Id;
        }

        private static ILocation ConnectHub(string hub, int? timeout)
        {
            if (timeout.HasValue) RpcConnection.Timeout = timeout.Value;

            var uri = new Uri(hub);
            var location = Location.FromUri(uri);
            location.AsNtlmUserViaProxy(CredentialCache.DefaultNetworkCredentials, false);
            return location;
        }

        private static IAppIdentifier GetApplicationId(string appId, ILocation location)
        {
            return location.GetAppIdentifiers().FirstOrDefault(appIdentifier => appIdentifier.AppId == appId);
        }

        private static void RemoveTags(XmlNode objectPropertiesXml, IReadOnlyCollection<string> excludedTags)
        {
            var excludeConditionList = excludedTags.Select(excludedTag => "descendant::" + excludedTag).ToList();

            foreach (var excludeCondition in excludeConditionList) ExcludeNodesWithNames(excludeCondition);

            void ExcludeNodesWithNames(string excludeConditions)
            {
                using var nodes = objectPropertiesXml.SelectNodes(excludeConditions);
                if (nodes == null) return;
                for (var i = nodes.Count - 1; i >= 0; i--) nodes[i]?.ParentNode?.RemoveChild(nodes[i]);
            }
        }

        private static void ConvertUnicodeEscapeSequences(XmlNode node)
        {
            foreach (XmlNode child in node.ChildNodes)
            {
                if (child.NodeType == XmlNodeType.Text)
                {
                    string newText = Regex.Replace(child.InnerText, @"[^\u0020-\u007E]", match => $"[Unicode: U+{(int)match.Value[0]:X4}]");
                    child.InnerText = newText;
                }
                else
                {
                    ConvertUnicodeEscapeSequences(child);
                }
            }
        }

        private static void ExportMasterItems(IApp app, string dumpPath, IReadOnlyCollection<string> excludedTags)
        {
            using (var dimensionList = app.GetDimensionList())
            {
                foreach (var dimension in dimensionList.Layout.DimensionList.Items)
                {
                    var dimensionXml = JsonConvert.DeserializeXmlNode(dimension.ToString(), "document");
                    RemoveTags(dimensionXml, excludedTags);
                    ConvertUnicodeEscapeSequences(dimensionXml.DocumentElement);
                    dimensionXml?.Save(Path.Combine(dumpPath, $"dimensionLayout_{dimension.Info.Id}.xml"));

                    var dimensionProperties = app.GetGenericDimension(dimension.Info.Id).GetProperties();
                    var dimensionPropertiesXml = JsonConvert.DeserializeXmlNode(dimensionProperties.ToString(), "document");
                    RemoveTags(dimensionPropertiesXml, excludedTags);
                    ConvertUnicodeEscapeSequences(dimensionPropertiesXml.DocumentElement);
                    dimensionPropertiesXml?.Save(Path.Combine(dumpPath, $"dimensionProperties_{dimension.Info.Id}.xml"));
                }
                dimensionList.Dispose();
            }

            using (var measureList = app.GetMeasureList())
            {
                foreach (var measure in measureList.Layout.MeasureList.Items)
                {
                    var measureXml = JsonConvert.DeserializeXmlNode(measure.ToString(), "document");
                    RemoveTags(measureXml, excludedTags);
                    ConvertUnicodeEscapeSequences(measureXml.DocumentElement);
                    measureXml?.Save(Path.Combine(dumpPath, $"measureLayout_{measure.Info.Id}.xml"));

                    var measureProperties = app.GetGenericMeasure(measure.Info.Id).GetProperties();
                    var measurePropertiesXml = JsonConvert.DeserializeXmlNode(measureProperties.ToString(), "document");
                    RemoveTags(measurePropertiesXml, excludedTags);
                    ConvertUnicodeEscapeSequences(measurePropertiesXml.DocumentElement);
                    measurePropertiesXml?.Save(Path.Combine(dumpPath, $"measureProperties_{measure.Info.Id}.xml"));
                }
                measureList.Dispose();
            }

            using (var masterObjectList = app.GetMasterObjectList())
            {
                foreach (var masterObject in masterObjectList.Layout.AppObjectList.Items)
                {
                    var masterObjectXml = JsonConvert.DeserializeXmlNode(masterObject.ToString(), "document");
                    RemoveTags(masterObjectXml, excludedTags);
                    ConvertUnicodeEscapeSequences(masterObjectXml.DocumentElement);
                    masterObjectXml?.Save(Path.Combine(dumpPath, $"masterObjectLayout_{masterObject.Info.Id}.xml"));

                    var masterObjectProperties = app.GetMasterObject(masterObject.Info.Id).GetProperties();
                    var masterObjectPropertiesXml = JsonConvert.DeserializeXmlNode(masterObjectProperties.ToString(), "document");
                    RemoveTags(masterObjectPropertiesXml, excludedTags);
                    ConvertUnicodeEscapeSequences(masterObjectPropertiesXml.DocumentElement);
                    masterObjectPropertiesXml?.Save(Path.Combine(dumpPath, $"masterObjectProperties_{masterObject.Info.Id}.xml"));
                }
                masterObjectList.Dispose();
            }
        }

        private static void ExportObjects(IApp app, string dumpPath, IEnumerable<string> visualisations, IReadOnlyCollection<string> excludedTags)
        {
            var objectList = app.GetSheetList();
            foreach (var sheet in objectList.Layout.SheetList.Items)
            {
                var sheetXml = JsonConvert.DeserializeXmlNode(sheet.ToString(), "document");
                RemoveTags(sheetXml, excludedTags);
                ConvertUnicodeEscapeSequences(sheetXml.DocumentElement);
                sheetXml?.Save(Path.Combine(dumpPath, $"sheetLayout_{sheet.Info.Id}.xml"));

                var sheetProperties = app.GetGenericSheet(sheet.Info.Id).GetProperties();
                var sheetPropertiesXml = JsonConvert.DeserializeXmlNode(sheetProperties.ToString(), "document");
                RemoveTags(sheetPropertiesXml, excludedTags);
                ConvertUnicodeEscapeSequences(sheetPropertiesXml.DocumentElement);
                sheetPropertiesXml?.Save(Path.Combine(dumpPath, $"sheetProperties_{sheet.Info.Id}.xml"));
            }
            objectList.Dispose();
        }

        private static void FlattenXml(XElement source, string hierarchicalIdRootLevel, string initialPath, XElement output)
        {
            if (source.HasElements)
            {
                foreach (var element in source.Elements())
                {
                    var newPath = string.IsNullOrEmpty(initialPath) ? element.Name.LocalName : $"{initialPath}.{element.Name.LocalName}";
                    FlattenXml(element, hierarchicalIdRootLevel, newPath, output);
                }
            }
            else
            {
                var attribute = new XElement(hierarchicalIdRootLevel, new XAttribute(initialPath, source.Value));
                output.Add(attribute);
            }
        }

        // Your QsAnalyzerConfig and QsResponse classes should also be defined here or in their own files
    }

    public class QsAnalyzerConfig
    {
        public string Server { get; set; }
        public string InputFolder { get; set; }
        public string OutputFolder { get; set; }
        public string[] Visualisations { get; set; }
        public string[] ExcludedTags { get; set; }
        public int Timeout { get; set; }
    }

    public class QsResponse
    {
        public string Id { get; set; }
    }
}
