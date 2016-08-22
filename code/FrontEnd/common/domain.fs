module MinimalFableSuave.FrontEnd.Domain

let formatOption defaultValue x = defaultArg (x |> Option.map (fun x -> x.ToString())) defaultValue