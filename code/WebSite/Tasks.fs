module MinimalFableSuave.Tasks

open MinimalFableSuave.Trigger
open System
open System.IO
open MinimalFableSuave.Sqldata

let private generatedReports = ref 0

let refreshRate = TimeSpan.FromMilliseconds 500.

type TaskMessage = 
    | CreateExcelReport of string

let taskAgent = 
    Agent.Start(fun agent -> 
        let rec loop() = 
            async { 
                let! msg = agent.Receive()
                match msg with
                | CreateExcelReport fileName ->
                    printfn "Generating Excel report %d at %s." !generatedReports fileName
                    
                    // TODO: Create a real excel report

                    generatedReports := !generatedReports + 1
                return! loop ()
            }
        loop())

let trigger = createTrigger refreshRate taskAgent

//Grab Reportdefinition from db
//
//let reportname = getReportsdefinition.Reportname
//let reportgoal = getReportsdefinition.Reportgoal
//let requirementlaw = getReportsdefintionen.

let month = DateTime.Now.AddMonths(-1).ToString("MMMM")

let createTasks () =
    RecurringTask(TimeSpan.FromSeconds 5., CreateExcelReport "output/Report1.xlsx")
    |> trigger.Post

let stopTasks () = trigger.Post Stop