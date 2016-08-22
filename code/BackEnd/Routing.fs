module MinimalFableSuave.BackEnd.Routing

open System
open System.IO
open System.Net
open MinimalFableSuave
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
open Suave.Operators
open Suave.Filters
open Suave.Successful
open Suave.Web
open Suave.Http
open Suave.RequestErrors
open Suave.Embedded
open Suave.Logging
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
// TODO: This should be removed/fixed (see issue #4)
let browseStaticFile file ctx = async {
  //let actualFile = Path.Combine(ctx.runtime.homeDirectory, "web", file)
  let actualFile = Path.Combine("web", file) //ctx.runtime.homeDirectory
  let mime = Suave.Writers.defaultMimeTypesMap(Path.GetExtension(actualFile))
  let setMime =
    match mime with
    | None -> fun c -> async { return None }
    | Some mime -> Suave.Writers.setMimeType mime.name
  return! ctx |> ( setMime >=> Successful.ok(File.ReadAllBytes actualFile) ) }

let browseStaticFiles ctx = async {
  let local = ctx.request.url.PathAndQuery
  let file = if local = "/" then "index.html" else local.Substring(1)
  return! browseStaticFile file ctx }

// Configure DotLiquid templates & register filters (in 'filters.fs')
[ for t in System.Reflection.Assembly.GetExecutingAssembly().GetTypes() do
    if t.Name = "Filters" && not (t.FullName.StartsWith "<") then yield t ]
|> Seq.last
|> DotLiquid.registerFiltersByType

let templatepath = Path.Combine(@"..\release\templates") 

DotLiquid.setTemplatesDir (templatepath) 

// Handles routing for the server
let app =
  choose
    [ 
      path "/"  >=> delay (fun () -> DotLiquid.page "fabletest.html" ())
      browseStaticFiles]     

open Logary.Suave

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
    ) |> Hopac.TopLevel.run
   
let config cancellationToken ipAddress port = 
    { defaultConfig with
        homeFolder = Some __SOURCE_DIRECTORY__
        logger = SuaveAdapter(logary.getLogger (PointName.parse "Logary.Services.SuaveReporter")) 
        //logger =  Logging.Loggers.ConsoleWindowLogger Logging.LogLevel.Verbose
        bindings = [ HttpBinding.mkSimple HTTP ipAddress port ]
        cancellationToken = cancellationToken}