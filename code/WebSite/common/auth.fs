module MinimalFableSuave.Auth

open System
open System.IO
open System.Collections
open System.DirectoryServices

// Querying Active Directory organizational units, groups, and members

type User =
    { Id: Guid;
      Username: string;
      Passwort: string }

let userQuery(username: string, password: string) =
    let userDirectory =
        new DirectoryEntry (
                Username = username,
                Password = password,
                Path = "LDAP://lab.lokal/OU=Benutzer,OU=LAB,DC=LAB,DC=lokal")

    use userSearcher = 
        new DirectorySearcher (
                SearchRoot = userDirectory, Filter = sprintf "(&(objectClass=user)(sAMAccountname=%s)(memberOf=CN=EnMS_Accessgroup_global,OU=EnMS,OU=Berechtigungen,OU=Gruppen,OU=LAB,DC=LAB,DC=lokal))" username)
    userSearcher.FindAll().Count