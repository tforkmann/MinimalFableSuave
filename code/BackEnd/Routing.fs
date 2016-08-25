module MinimalFableSuave.BackEnd.Routing

open System
open System.IO
open System.Net
open MinimalFableSuave
open MinimalFableSuave.BackEnd.Filters
open MinimalFableSuave.BackEnd.Sqldata
open MinimalFableSuave.BackEnd.Utils
open MinimalFableSuave.BackEnd.Db
open MinimalFableSuave.BackEnd.Auth
open System.Web
open System.Collections
open System.DirectoryServices
open XPlot.GoogleCharts
open System.Linq

open FSharp.Data
open FSharp.Linq
open NetOffice.ExcelApi
open System.Xml
open System.Xml.Linq

// Suave
open Suave
open Suave.Http
open Suave.RequestErrors
open Suave.Embedded
open Suave.Logging
open Suave.Successful      // for OK-result
open Suave.Web             // for config
open Suave.Filters
open Suave.Operators
open Suave.Files

//Logary
open NodaTime
open Logary
open Logary.Configuration
open Logary.Targets
open Logary.Suave
open Logary.Metrics

// System.DirectoryServices
open System.DirectoryServices

// FSharp Formatting
open FSharp.Formatting

// -------------------------------------------------------------------------------------------------
// Server entry-point and routing
// -------------------------------------------------------------------------------------------------


open System

let comments = [
    { Comment.id = Some DateTime.Now ; author = "jimmy" ; text = "hello"}
    ]

let json = Suave.Json.toJson comments

let noCache =
  Writers.setHeader "Cache-Control" "no-cache, no-store, must-revalidate"
  >=> Writers.setHeader "Pragma" "no-cache"
  >=> Writers.setHeader "Expires" "0"

let webRoot = Path.GetFullPath(Path.Combine(@"..\Release\", "templates"))
let templatesRoot =Path.Combine(@"..\Release\", "templates")
let clientRoot = Path.GetFullPath(Path.Combine(@"..\Release\", "web"))

// Configure DotLiquid templates & register filters (in 'filters.fs')
[ for t in System.Reflection.Assembly.GetExecutingAssembly().GetTypes() do
    if t.Name = "Filters" && not (t.FullName.StartsWith "<") then yield t ]
|> Seq.last
|> DotLiquid.registerFiltersByType

DotLiquid.setTemplatesDir templatesRoot

printfn "Path: %s" webRoot

/// Handles routing for the server
let app : WebPart =         
    choose [
        // REST API for sharing model betweeen server and client
        GET >=> path "/api/comments" >=> OK @"[{""id"" : 1388534400000, ""author"" : ""jimmy"", ""text"" : ""hello""}]"
    
        // Serving the generated CSS,JS and source maps
        path "/lib/jquery.js" >=> Files.browseFile clientRoot (Path.Combine("lib", "jquery.js"))
        path "/lib/chosen.jquery.min.js" >=> Files.browseFile clientRoot (Path.Combine("lib", "/chosen.jquery.min"))
        path "/lib/bootstrap.min.css" >=> Files.browseFile clientRoot (Path.Combine("lib", "bootstrap.min.css"))
        path "/lib/jquerysearchable.min.js" >=> Files.browseFile clientRoot (Path.Combine("lib", "jquerysearchable.min.js"))
        path "/content/bundle.js" >=> Files.browseFile clientRoot (Path.Combine("content", "bundle.js"))
        path "/content/chosen.css" >=> Files.browseFile clientRoot (Path.Combine("content","chosen.css"))
        path "/content/multiselect.css" >=> Files.browseFile clientRoot (Path.Combine("content","multiselect.css"))
        path "/content/multiselect.js" >=> Files.browseFile clientRoot (Path.Combine("content","multiselect.js"))
        path "/content/search.js" >=> Files.browseFile clientRoot (Path.Combine("content","search.js"))
        path "/content/style.css" >=> Files.browseFile clientRoot (Path.Combine("content","style.css"))
        path "/img/fsharplogo.png" >=> Files.browseFile clientRoot (Path.Combine("img", "fsharpLogo.png"))
        path "/content/testpage.js" >=> Files.browseFile clientRoot (Path.Combine("content","pages","testpage.js"))
        path "/content/testpage.js.map" >=> Files.browseFile clientRoot (Path.Combine("content","pages", "testpage.js.map"))
        pathScan "/node_modules/%s.js" (sprintf "/node_modules/%s.js" >> Files.browseFile clientRoot)

         // Serving index and other static files
        path "/" >=> Files.browseFile webRoot "page.html"
        Files.browse webRoot
        // Catches RequestErrors
        RequestErrors.NOT_FOUND "Found no handlers."
    ]  

/// Using LogaryManager to generate an SuaveReport
let logary =
    let path = Path.Combine(@"..\release\")
    withLogaryManager "Logary.Services.SuaveReporter" (
        withTargets [
            Logary.Targets.TextWriter.create(
                let textConf = 
                    TextWriter.TextWriterConf.create(
                        Path.Combine(path, DateTime.UtcNow.ToString("yyyy-MM-dd") + "-happy.log") |> File.AppendText, 
                        Path.Combine(path, DateTime.UtcNow.ToString("yyyy-MM-dd") + "-sad.log") |> File.AppendText)
                let newConf = { textConf with flush = true }
                newConf
            ) "filelogger"
        ] >>
        withRules [
            Rule.createForTarget "filelogger"
        ]
    ) |> Hopac.Hopac.run
   
let config cancellationToken ipAddress port = 
    { defaultConfig with
        homeFolder = Some __SOURCE_DIRECTORY__
        logger = SuaveAdapter(logary.getLogger (PointName.parse "Logary.Services.SuaveReporter")) 
        //logger =  Logging.Loggers.ConsoleWindowLogger Logging.LogLevel.Verbose
        bindings = [ HttpBinding.mkSimple HTTP ipAddress port ]
        cancellationToken = cancellationToken}