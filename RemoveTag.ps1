$tagName = "YourTagName"
$tags = Get-QlikTag
$tag = $tags | Where-Object { $_.name -eq $tagName }

if ($tag) {
    Remove-QlikTag -Id $tag.id
    Write-Output "Tag '$tagName' has been removed from the server."
} else {
    Write-Output "Tag '$tagName' does not exist on the server."
}
