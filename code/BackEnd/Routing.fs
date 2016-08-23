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

let templatesRoot = Path.Combine(__SOURCE_DIRECTORY__, "FrontEnd","templates")
let clientRoot = Path.Combine(__SOURCE_DIRECTORY__, "FrontEnd", "out", "pages")

// Configure DotLiquid templates & register filters (in 'filters.fs')
[ for t in System.Reflection.Assembly.GetExecutingAssembly().GetTypes() do
    if t.Name = "Filters" && not (t.FullName.StartsWith "<") then yield t ]
|> Seq.last
|> DotLiquid.registerFiltersByType

let templatepath = Path.Combine(@"..\release\templates") 

DotLiquid.setTemplatesDir templatepath

/// Handles routing for the server
let app : WebPart =         
    choose [
        // REST API for sharing model betweeen server and client
        GET >=> path "/api/comments" >=> OK @"[{""id"" : 1388534400000, ""author"" : ""jimmy"", ""text"" : ""hello""}]"
    
        // Serving the generated JS and source maps
        path "/out/client.js" >=> noCache >=> Files.browseFile clientRoot (Path.Combine("out", "fabletest.js"))
        path "/out/client.js.map" >=> noCache >=> Files.browseFile clientRoot (Path.Combine("out", "fabletest.js.map"))
        pathScan "/node_modules/%s.js" (sprintf "/node_modules/%s.js" >> Files.browseFile clientRoot)
        Files.browseHome
        Files.browseFileHome "./views/index.html"

         // Serving index and other static files
        path "/" >=> Files.browseFile templatesRoot "index.html"
        Files.browse templatesRoot
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