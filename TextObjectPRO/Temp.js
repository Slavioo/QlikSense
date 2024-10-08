private static void FlattenXml(XElement element, string hierarchicalId, string currentPath, XElement outputXml, int parentqsaIndex = 0, string parentHierarchicalId = "0")
{
    // Update the current path
    currentPath += "/" + element.Name;

    // Create a StringBuilder for collecting attributes
    StringBuilder attributesBuilder = new StringBuilder();

    // Collect attributes
    foreach (var attribute in element.Attributes())
    {
        attributesBuilder.Append($"{attribute.Name}={attribute.Value} ");
    }

    // Determine the element type
    string elementType = element.HasElements ? "Element" : "Text";

    // Prepare output element
    XElement outputElement = new XElement("record",
        new XAttribute("qsaId", hierarchicalId),
        new XAttribute("qsaParentId", parentHierarchicalId),
        new XAttribute("qsaElementType", elementType),
        new XAttribute("qsaPath", currentPath.Trim('/')));

    // Add attributes if any
    if (attributesBuilder.Length > 0)
    {
        outputElement.Add(new XAttribute("qsaAttribute", attributesBuilder.ToString().TrimEnd()));
    }

    // Calculate the index
    int qsaIndex;

    if (element.HasElements)
    {
        // Use LINQ to count the existing records for the current path
        qsaIndex = outputXml.Descendants("record")
            .Count(e => e.Attribute("qsaPath")?.Value == currentPath.Trim('/'));

        outputElement.Add(new XAttribute("qsaIndex", qsaIndex + 1));
        outputXml.Add(outputElement);

        int childIndex = 1;
        foreach (var child in element.Elements())
        {
            string childHierarchicalId = $"{hierarchicalId}.{childIndex}";
            FlattenXml(child, childHierarchicalId, currentPath, outputXml, qsaIndex, hierarchicalId);
            childIndex++;
        }
    }
    else
    {
        qsaIndex = parentqsaIndex;
        outputElement.Add(new XAttribute("qsaIndex", qsaIndex + 1));

        // Count the text indices for the current path and parent ID
        var qsaTextIndex = outputXml.Descendants("record")
            .Count(e => e.Attribute("qsaPath")?.Value == currentPath.Trim('/') && e.Attribute("qsaParentId")?.Value == parentHierarchicalId);

        outputElement.Add(new XAttribute("qsaTextIndex", qsaTextIndex + 1));

        if (!string.IsNullOrEmpty(element.Value))
        {
            outputElement.Add(new XAttribute("qsaValue", element.Value));
        }

        outputXml.Add(outputElement);
    }
}
