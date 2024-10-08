private static void FlattenXml(XElement element, string hierarchicalId, string currentPath, XElement outputXml, int parentqsaIndex = 0, string parentHierarchicalId = "0")
{
    // Using StringBuilder for efficient string concatenation
    var currentPathBuilder = new StringBuilder(currentPath).Append('/').Append(element.Name);
    string currentElementPath = currentPathBuilder.ToString();

    // Collect attributes into a string
    var attributesBuilder = new StringBuilder();
    foreach (var attribute in element.Attributes())
    {
        attributesBuilder.Append(attribute.Name).Append('=').Append(attribute.Value).Append(' ');
    }

    string elementType = element.HasElements ? "Element" : "Text";

    // Create a new output element with necessary attributes
    var outputElement = new XElement("record",
        new XAttribute("qsaId", hierarchicalId),
        new XAttribute("qsaParentId", parentHierarchicalId),
        new XAttribute("qsaElementType", elementType),
        new XAttribute("qsaPath", currentElementPath.Trim('/'))
    );

    if (attributesBuilder.Length > 0)
    {
        outputElement.Add(new XAttribute("qsaAttribute", attributesBuilder.ToString().TrimEnd()));
    }

    if (element.HasElements)
    {
        // Calculate qsaIndex based on element path to minimize repeated LINQ lookups
        int qsaIndex = outputXml.Elements("record")
            .Count(e => e.Attribute("qsaPath")?.Value == currentElementPath.Trim('/'));

        outputElement.Add(new XAttribute("qsaIndex", qsaIndex + 1));
        outputXml.Add(outputElement);

        // Iterate over child elements
        int childIndex = 1;
        foreach (var child in element.Elements())
        {
            // Recursively flatten child elements, generating a hierarchical ID
            string childHierarchicalId = $"{hierarchicalId}.{childIndex}";
            FlattenXml(child, childHierarchicalId, currentElementPath, outputXml, qsaIndex, hierarchicalId);
            childIndex++;
        }
    }
    else
    {
        // If element has no children, add a "text" record
        int qsaTextIndex = outputXml.Elements("record")
            .Count(e => e.Attribute("qsaPath")?.Value == currentElementPath.Trim('/') 
                     && e.Attribute("qsaParentId")?.Value == parentHierarchicalId);

        outputElement.Add(new XAttribute("qsaIndex", parentqsaIndex + 1));
        outputElement.Add(new XAttribute("qsaTextIndex", qsaTextIndex + 1));

        if (!string.IsNullOrEmpty(element.Value))
        {
            // Add the value of the element if it's not empty
            outputElement.Add(new XAttribute("qsaValue", element.Value));
        }

        outputXml.Add(outputElement);
    }
}
