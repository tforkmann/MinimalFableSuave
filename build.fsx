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

Target "deploy" (fun _ ->
  let sourceDirectoryNodeModules = __SOURCE_DIRECTORY__ @@ "code/FrontEnd/node_modules"
  let sourceDirectoryContent = __SOURCE_DIRECTORY__ @@ "code/FrontEnd/web/content"
  let binDirectoryNodeModule = __SOURCE_DIRECTORY__ @@ "bin/Release/web/node_modules"
  let binDirectoryContent = __SOURCE_DIRECTORY__ @@ "bin/Release/web/content"
  CleanDir binDirectoryNodeModule
  CleanDir binDirectoryContent
  CopyRecursive sourceDirectoryNodeModules binDirectoryNodeModule false |> ignore
  CopyRecursive sourceDirectoryContent binDirectoryContent false |> ignore
)

//let run cmd args dir =
//    if execProcess( fun info ->
//        info.FileName <- cmd
//        if not( String.IsNullOrWhiteSpace dir) then
//            info.WorkingDirectory <- dir
//        info.Arguments <- args
//    ) System.TimeSpan.MaxValue = false then
//        traceError <| sprintf "Error while running '%s' with args: %s and workingDirectory: %s" cmd args __SOURCE_DIRECTORY__
//
//let platformTool tool path =
//    isUnix |> function | true -> tool | _ -> path
//
//let npmTool =
//    platformTool "npm" ("packages" </> "Npm.js" </> "tools"  </> "npm.cmd" |> FullName)
//
////Target "RunScript" (fun _ ->
////    run npmTool "install" ""
////    run npmTool "run build" ""
////)

let npm command args workingDir =
  let args = sprintf "%s %s" command (String.concat " " args)
  let cmd, args = if EnvironmentHelper.isUnix then "npm", args else "cmd", ("/C npm " + args)
  let ok =
    execProcess (fun info ->
      info.FileName <- cmd
      info.WorkingDirectory <- workingDir
      info.Arguments <- args) TimeSpan.MaxValue
  if not ok then failwith (sprintf "'%s %s' task failed" cmd args)

let node command args workingDir =
  let args = sprintf "%s %s" command (String.concat " " args)
  let cmd, args = if EnvironmentHelper.isUnix then "node", args else "cmd", ("/C node " + args)
  async { 
    execProcess (fun info ->
      info.FileName <- cmd
      info.WorkingDirectory <- workingDir
      info.Arguments <- args) TimeSpan.MaxValue |> ignore } |> Async.Start

Target "fable" (fun _ ->
  __SOURCE_DIRECTORY__ </> "code" </> "FrontEnd" |> npm "install" []
  __SOURCE_DIRECTORY__ </> "code" </> "FrontEnd" |> node "node_modules/fable-compiler" ["-w"]
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
    let app = Path.Combine("bin",config,"MinimalFableSuave.Service.exe")
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


"Clean"
  ==> "Build"
  ==> "Fable"
  ==> "Deploy"
  ==> "Run"
  ==> "Default"

RunTargetOrDefault "Default"