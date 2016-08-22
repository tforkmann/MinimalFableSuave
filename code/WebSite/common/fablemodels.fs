module MinimalFableSuave.Models
open System

// Model shared between server and client
type Comment = {
    Id: DateTime option
    Author: string
    Text: string
}