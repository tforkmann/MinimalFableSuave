module MinimalFableSuave.FrontEnd.Domain

let formatOption defaultValue x = defaultArg (x |> Option.map (fun x -> x.ToString())) defaultValue

let formatNotAvailable x = formatOption "(Nicht vorhanden)" x

let zeroIfEmpty x = defaultArg x 0

let killprocess processname = 
    let processArray = System.Diagnostics.Process.GetProcessesByName(processname);
    for processes in processArray do
        if processes.MainWindowTitle.Length = 0 then processes.Kill ()