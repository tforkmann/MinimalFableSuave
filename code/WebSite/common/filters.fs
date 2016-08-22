module MinimalFableSuave.Filters

open System
open MinimalFableSuave.Utils

// -------------------------------------------------------------------------------------------------
// Filters that can be used in DotLiquid templates
// -------------------------------------------------------------------------------------------------

let formatId (id:int) =
  mangleId id

let urlEncode (url:string) =
  System.Web.HttpUtility.UrlEncode(url)

let urlDecode (input:string) =
  System.Web.HttpUtility.UrlDecode(input)

let niceDate (dt:DateTime) =
  let ts = DateTime.UtcNow - dt
  if ts.TotalSeconds < 60.0 then sprintf "%d secs ago" (int ts.TotalSeconds)
  elif ts.TotalMinutes < 60.0 then sprintf "%d mins ago" (int ts.TotalMinutes)
  elif ts.TotalHours < 24.0 then sprintf "%d hours ago" (int ts.TotalHours)
  elif ts.TotalHours < 48.0 then sprintf "yesterday"
  elif ts.TotalDays < 30.0 then sprintf "%d days ago" (int ts.TotalDays)
  elif ts.TotalDays < 365.0 then sprintf "%d months ago" (int ts.TotalDays / 30)
  else sprintf "%d years ago" (int ts.TotalDays / 365)

let lastyear (dt:DateTime) = sprintf "%d001 " (DateTime.Now.AddYears(-1).Year)

let thisyear (dt:DateTime) = sprintf "%d001 " (DateTime.Now.Year)