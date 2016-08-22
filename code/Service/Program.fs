open Suave
open Suave.Successful
open Suave.Web
open Suave.Http
open Suave.Filters
open Topshelf
open System
open System.Threading
open FSharp.Configuration

// Get IP Address and port no. from Config.Yaml


type Config = YamlConfig<"\\config.yaml">

let configFile = Config ()

let newConfigFile = configFile.Load("C:\RunTimeConfig.yaml")

let ipAddress = configFile.Suave.Http.IP
let portConfig = configFile.Suave.Http.Port

let rec findPort port =
  let portIsTaken =
    System.Net.NetworkInformation.IPGlobalProperties.GetIPGlobalProperties().GetActiveTcpListeners()
    |> Seq.exists (fun x -> x.Port = port)

  if portIsTaken then findPort (port + 1) else port

[<EntryPoint>]
let main argv =
    let cancellationTokenSource = ref None

    let start hc = 
        let cts = new CancellationTokenSource()
        let token = cts.Token
        let port = findPort portConfig
        let config = MinimalFableSuave.BackEnd.Routing.config cts.Token ipAddress port
        printfn "IPAddres received from config file %s" ipAddress
        printfn "Port received from config file %i" port

        startWebServerAsync config MinimalFableSuave.BackEnd.Routing.app
        |> snd
        |> Async.StartAsTask 
        |> ignore

        cancellationTokenSource := Some cts
        MinimalFableSuave.BackEnd.Tasks.createTasks()
        true

    let stop hc = 
        match !cancellationTokenSource with
        | Some cts -> cts.Cancel()
        | None -> ()
        MinimalFableSuave.BackEnd.Tasks.stopTasks()
        true

    Service.Default 
    |> display_name "MinimalFableSuave"
    |> instance_name "MinimalFableSuave"
    |> with_start start
    |> with_stop stop
    |> run