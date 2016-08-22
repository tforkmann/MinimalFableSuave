#r "packages/FAKE/tools/FakeLib.dll"
#r "packages/FSharp.Configuration/lib/net40/FSharp.Configuration.dll"
open Fake
open Fake.NpmHelper
open System
open System.IO
open FSharp.Configuration    

let solutionFile  = "MinimalFableSuave.WebSite.sln"

let config = if hasBuildParam "NoDB" then failwith "NoDB" else "Release"

Target "Clean" (fun _ ->
    CleanDirs ["bin"]
)

let build() =
    !! solutionFile
    |> MSBuild "" "Build" [ "Configuration", config ]
    |> ignore

let run cmd args dir =
    if execProcess( fun info ->
        info.FileName <- cmd
        if not( String.IsNullOrWhiteSpace dir) then
            info.WorkingDirectory <- dir
        info.Arguments <- args
    ) System.TimeSpan.MaxValue = false then
        traceError <| sprintf "Error while running '%s' with args: %s and workingDirectory: %s" cmd args __SOURCE_DIRECTORY__

let platformTool tool path =
    isUnix |> function | true -> tool | _ -> path

let npmTool =
    platformTool "npm" ("packages" </> "Npm.js" </> "tools"  </> "npm.cmd" |> FullName)

Target "RunScript" (fun _ ->
    run npmTool "install" ""
    run npmTool "run build" ""
)

Target "Build" (fun _ ->
    build()
)

let rec runWebsite() =
    let codeFolder = FullName "code"
    use watcher = new FileSystemWatcher(codeFolder, "*.fs")
    watcher.EnableRaisingEvents <- true
    watcher.IncludeSubdirectories <- true
    watcher.Changed.Add(handleWatcherEvents)
    watcher.Created.Add(handleWatcherEvents)
    watcher.Renamed.Add(handleWatcherEvents)

    build()
    let app = Path.Combine("bin",config,"EnMSDashboard.Service.exe")
    let ok =
        execProcess (fun info ->
            info.FileName <- app
            info.Arguments <- "") TimeSpan.MaxValue
    if not ok then tracefn "Website shut down."
    watcher.Dispose()

and handleWatcherEvents (e:IO.FileSystemEventArgs) =
    tracefn "Rebuilding website...."

    let runningWebsites =
        System.Diagnostics.Process.GetProcessesByName("MinimalFableSuave.Service")
        |> Seq.iter (fun p -> p.Kill())

    runWebsite()

// Get IP Address and port no. from Config.Yaml
//let getProgramsPath = Environment.SpecialFolder.Programs
//let getConfigPath = Path.Combine (getProgramsPath, "\EnMS-Dahsboard\Config\config.yaml")

type Config = YamlConfig<"\\config.yaml">

let configFile = Config ()

let ipAddress = configFile.Suave.Http.IP
let port = configFile.Suave.Http.Port

let newConfigFile = configFile.Load("C:\RunTimeConfig.yaml")

Target "Run" (fun _ ->
    printfn "IPAddres received from config file %s" ipAddress
    printfn "Port received from config file %i" port
    async {
        System.Threading.Thread.Sleep(3000)
        Diagnostics.Process.Start("http://"+ ipAddress + sprintf ":%d" port) |> ignore }
    |> Async.Start

    runWebsite()
)

Target "Default" DoNothing

Target "Deploy" DoNothing

"Clean"
  ==> "Build"
  ==> "RunScript"
  ==> "Run"
  ==> "Default"

RunTargetOrDefault "Default"