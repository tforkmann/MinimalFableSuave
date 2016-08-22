module MinimalFableSuave.Domain

// Mini Query

//type Queryelements =
//  { Bezeichnung : string;
//    Strasse : string }

// Energyplants

#if NODB 
    type Heatingnets =
  { BaujahrTrasse : string;  
    Energietraeger : string ;
    Netzeigentuemer : string ;
    Verlegungsart : string ;
    Bezeichnung : string;
    Material : string }
#endif

type Measures =
  { Saktobez : string;
    Kststelle : string ;
    Betrag : decimal ;
    Menge : float ;
    Einheit : string ;
    VUPeriode : int }

// Optimizationsfeatures

let formatOption defaultValue x = defaultArg (x |> Option.map (fun x -> x.ToString())) defaultValue

let formatNotAvailable x = formatOption "(Nicht vorhanden)" x

let zeroIfEmpty x = defaultArg x 0

let killprocess processname = 
    let processArray = System.Diagnostics.Process.GetProcessesByName(processname);
    for processes in processArray do
        if processes.MainWindowTitle.Length = 0 then processes.Kill ()