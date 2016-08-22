module MinimalFableSuave.Sqldata

open System
open System.IO
open System.Data
open System.Data.SqlClient
open MinimalFableSuave.Db
open MinimalFableSuave.Domain
open MinimalFableSuave.Filters
open FSharp.Reflection

// // -------------------------------------------------------------------------------------------------
// // Mappers - Using dataContext to use generated types from db
// // -------------------------------------------------------------------------------------------------

// let mapMeasure (dbRecord:Sql.dataContext.``dbo.EnmsSichtEntity``) : MinimalFableSuave.Domain.Measures =
//     {   Saktobez = dbRecord.Saktobez
//         Kststelle =
//             match  dbRecord.KstStelle with
//             | Some x -> x
//             | None -> "KstStelle nicht gepflegt"
//         Betrag = 
//             match  dbRecord.Betrag with
//             | Some x -> x
//             | None -> 0.0m
//         Menge = 
//             match  dbRecord.SumMenge with
//             | Some x -> x
//             | None -> 0.0
//         Einheit = dbRecord.Meh
//         VUPeriode = 
//             match  dbRecord.VuPeriode with
//             | Some x -> x
//             | None ->  0 }

// // -------------------------------------------------------------------------------------------------
// // Private Backend Views
// // -------------------------------------------------------------------------------------------------

// let private allMeasures = db.Dbo.EnmsSicht
// // -------------------------------------------------------------------------------------------------
// // Public Queries
// // -------------------------------------------------------------------------------------------------

// // Queries Measures
// // -------------------------------------------------------------------------------------------------
// let getMeasureAverageByKst measureName (kst:string) (vuperiode:int) =
//     query { for measures in allMeasures do
//             where (measures.KstStelle.Value = kst && measures.Saktobez.Contains measureName && measures.VuPeriode.Value >= vuperiode)
//             select (measures.SumMenge.Value)}
//     |> Seq.sum