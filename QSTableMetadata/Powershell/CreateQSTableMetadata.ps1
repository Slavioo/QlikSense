#Set Parameters
$App = Read-Host -Prompt 'Input the dashboard name. (Hint: TestApp)'
$Sheet = Read-Host -Prompt 'Input the sheet name. (Hint: TestSheet)'
#Create Dimensions Metadata
$inputCSVFile = "C:\Projects\QSTableMetadata\Input\$App\$Sheet\qDimensions.csv"
$outputJSONFile = "C:\Projects\QSTableMetadata\Output\$App\$Sheet\qDimensions.json"
$toJSON = import-csv $inputCSVFile -Delimiter ";" | Group-Object -Property cId,qFieldDefs,qLabelExpression,qCond | ForEach-Object { 
  [pscustomobject]@{
    qLibraryId = ""
    qDef = [pscustomobject]@{
      qGrouping = "N"
      qFieldDefs = @(
        $_.Values[1]
      )
      qFieldLabels = @(
        ""
      )
      qSortCriterias = @(
        [pscustomobject]@{
          qSortByState = 0
          qSortByFrequency = 0
          qSortByNumeric = 1
          qSortByAscii = 1
          qSortByLoadOrder = 1
          qSortByExpression = 0
          qExpression = [pscustomobject]@{
            qv = ""
          }
          qSortByGreyness = 0
        }
      )
      qNumberPresentations = @()
      qReverseSort = $false
      qActiveField = 0
      qLabelExpression = $_.Values[2]
      autoSort = $true
      cId = $_.Values[0]
      othersLabel = "Others"
      textAlign = [pscustomobject]@{
        auto = $true
        align = "left"
      }
      representation = [pscustomobject]@{
        type ="text"
        urlPosition = "dimension"
        urlLabel = ""
        linkUrl = ""
        imageSetting = "label"
        imageLabel = ""
        imageUrl = ""
        imageSize = "fitHeight"
        imagePosition = "topCenter"
      }
    }
    qNullSuppression = $false
    qIncludeElemValue = $false
    qOtherTotalSpec = [pscustomobject]@{
      qOtherMode ="OTHER_OFF"
      qOtherCounted = [pscustomobject]@{
        qv = "10"
      }
      qOtherLimit = [pscustomobject]@{
        qv = "0"
      }
      qOtherLimitMode = "OTHER_GE_LIMIT"
      qSuppressOther = $false
      qForceBadValueKeeping = $true
      qApplyEvenWhenPossiblyWrongResult = $true
      qGlobalOtherGrouping = $false
      qOtherCollapseInnerDimensions = $false
      qOtherSortMode = "OTHER_SORT_DESCENDING"
      qTotalMode = "TOTAL_OFF"
      qReferencedExpression = [pscustomobject]@{
        qv = ""
      }
   }
    qShowTotal = $false
    qShowAll = $false
    qOtherLabel = [pscustomobject]@{
      qv = "Others"
    }
    qTotalLabel = [pscustomobject]@{
      qv = ""
    }
    qCalcCond = [pscustomobject]@{
      qv = ""
    }
    qAttributeExpressions = @()
    qAttributeDimensions = @()
    qCalcCondition = [pscustomobject]@{
      qCond = [pscustomobject]@{
        qv = $_.Values[3]
      }
      qMsg = [pscustomobject]@{
        qv = ""
      }
    }
  }
} | ConvertTo-Json -Depth 5 | % { [System.Text.RegularExpressions.Regex]::Unescape($_) } | Out-File $outputJSONFile -Force
#Create Measures Metadata
$inputCSVFile = "C:\Projects\QSTableMetadata\Input\$App\$Sheet\qMeasures.csv"
$outputJSONFile = "C:\Projects\QSTableMetadata\Output\$App\$Sheet\qMeasures.json"
$toJSON = import-csv $inputCSVFile -Delimiter ";" | Group-Object -Property cId,qDef,qLabelExpression,qCond | ForEach-Object { 
  [pscustomobject]@{
    qLibraryId = ""
    qDef = [pscustomobject]@{
      qLabel = ""
      qDescription = ""
      qTags = @()
      qGrouping = "N"
      qDef = $_.Values[1]
      qNumFormat = [pscustomobject]@{
        qType = "U"
        qnDec = 2
        qUseThou = 0
        qFmt = ""
        qDec = "."
        qThou = ","
      }
      qRelative = $false
      qBrutalSum = $false
      qAggrFunc = "Expr"
      qAccumulate = 0
      qReverseSort = $false
      qActiveExpression = 0
      qExpressions = @()
      qLabelExpression = $_.Values[2]
      autoSort = $true
      cId = $_.Values[0]
      numFormatFromTemplate = $true
      textAlign = [pscustomobject]@{
        auto = $true
        align = "left"
      }
      representation = [pscustomobject]@{
        type ="text"
        indicator = [pscustomobject]@{
          showTextValues = $true
          applySegmentColors = $false
          position = "right"
        }
        miniChart = [pscustomobject]@{
          type = "sparkline"
          colors = [pscustomobject]@{
            main = [pscustomobject]@{
              index = 6
            }
            max = [pscustomobject]@{
              index = 0
              color = "none"
            }
            min = [pscustomobject]@{
              index = 0
              color = "none"
            }
            first = [pscustomobject]@{
              index = 0
              color = "none"
            }
            last = [pscustomobject]@{
              index = 0
              color = "none"
            }
            positive = [pscustomobject]@{
              index = 6
            }
            negative = [pscustomobject]@{
              index = 10
              color = "#f93f17"
            }
          }
          showDots = $true
          yAxis = [pscustomobject]@{
            scale = "local"
            position = "auto"
          }
        }
        imageSetting = "label"
        imageLabel = ""
        imageUrl = ""
        imageSize = "fitHeight"
        imagePosition = "topCenter"
      }
      conditionalColoring = [pscustomobject]@{
        segments = [pscustomobject]@{
          limits = @()
          paletteColors = @(
            [pscustomobject]@{
              "index" = 6
              "icon" = "dot"
            }
          )
        }
      }
      isCustomFormatted = $false
    }
    qSortBy = [pscustomobject]@{
      qSortByState = 0
      qSortByFrequency = 0
      qSortByNumeric = 1
      qSortByAscii = 1
      qSortByLoadOrder = 1
      qSortByExpression = 0
      qExpression = [pscustomobject]@{
        qv = ""
      }
        qSortByGreyness = 0
    }
    qAttributeExpressions = @(
      [pscustomobject]@{
        qExpression = "v_CurrentCobColor"
        qLibraryId = ""
        qAttribute = $true
        qNumFormat = $null
        qLabel = ""
        qLabelExpression = ""
        id = "cellBackgroundColor"
      }
    )
    qAttributeDimensions = @()
    qCalcCond = [pscustomobject]@{
      qv = ""
    }
    qCalcCondition = [pscustomobject]@{
      qCond = [pscustomobject]@{
        qv = $_.Values[3]
      }
      qMsg = [pscustomobject]@{
        qv = ""
      }
    }
    qTrendLines = @()
    qMiniChartDef = [pscustomobject]@{
      qDef = ""
      qLibraryId = ""
      qSortBy = [pscustomobject]@{
        qSortByState = 0
        qSortByFrequency = 0
        qSortByNumeric = 0
        qSortByAscii = 0
        qSortByLoadOrder = 0
        qSortByExpression = 0
        qExpression = [pscustomobject]@{
          qv  = ""
        }
        qSortByGreyness = 0
      }
      qOtherTotalSpec = [pscustomobject]@{
        qOtherMode = "OTHER_OFF"
        qOtherCounted = [pscustomobject]@{
          qv = ""
        }
        qOtherLimit = [pscustomobject]@{
          qv = ""
        }
        qOtherLimitMode = "OTHER_GT_LIMIT"
        qSuppressOther = $true
        qForceBadValueKeeping = $true
        qApplyEvenWhenPossiblyWrongResult = $true
        qGlobalOtherGrouping = $false
        qOtherCollapseInnerDimensions = $false
        qOtherSortMode = "OTHER_SORT_DESCENDING"
        qTotalMode = "TOTAL_OFF"
        qReferencedExpression = [pscustomobject]@{
          qv = ""
        }
      }
      qMaxNumberPoints = -1
      qAttributeExpressions = @()
      qNullSuppression = $true
    }
  }
} | ConvertTo-Json -Depth 5 | % { [System.Text.RegularExpressions.Regex]::Unescape($_) } | Out-File $outputJSONFile -Force
#End
Write-Host "You will find the Dimensions & Measures Metadata for '$App' - '$Sheet' in C:\Projects\QSTableMetadata\Output\$App\$Sheet"
Start-Sleep -Seconds 5
Write-Host "Bye!"
Start-Sleep -Seconds 2