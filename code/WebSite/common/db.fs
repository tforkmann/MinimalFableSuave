module MinimalFableSuave.Db

open System
open System.IO
open MinimalFableSuave.Config
open FSharp.Linq
open System.Data.SqlClient
open FSharp.Reflection

// #if NODB
// let [<Literal>] CompileTimeConnectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=SageEnMS;Integrated Security=True"
// #else

// let [<Literal>] CompileTimeConnectionString = "Data Source=SQLDG\DG;Initial Catalog=SageEnMS;User ID=enmsreporting;password=re6Pheix"

// let [<Literal>] ResolutionPath = __SOURCE_DIRECTORY__

// #endif

// type Sql = SqlDataProvider<ConnectionString = CompileTimeConnectionString, UseOptionTypes=true>
// let triggerSQL = Common.QueryEvents.SqlQueryEvent |> Observable.subscribe(printfn "Excecuting SQL: %s")

// let db = Sql.GetDataContext connectionString