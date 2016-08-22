module MinimalFableSuave.Trigger

open System

type Agent<'T> = MailboxProcessor<'T>

type TriggerEvent<'a> = 
| SingleTask of DateTime * 'a
| RecurringTask of TimeSpan * 'a
| Sleep of TimeSpan
| Stop

let createTrigger<'a> refreshRate (taskAgent : Agent<'a>) = 
  Agent.Start(fun agent -> 
    let rec loop singleTasks recurringTasks = 
      async { 
        let! msg = agent.Receive()
        match msg with
        | Stop -> ()
        | _ ->
          let singleTasks = ref singleTasks
          let recurringTasks = ref recurringTasks
            
          match msg with
          | SingleTask(time, message) -> 
              singleTasks := (time, message) :: !singleTasks
          | RecurringTask(recurringRate, message) ->
              recurringTasks := 
                (DateTime.Today.AddHours(13.0) + recurringRate,recurringRate, message) :: !recurringTasks
          | Sleep timeSpan ->
              do! Async.Sleep(timeSpan.Milliseconds)
          | Stop -> ()

          let currentTime = DateTime.Now
          let rest, dueSingleTasks = 
              !singleTasks
              |> List.partition (fun (time,_) -> time > currentTime)
               
          for _, message in dueSingleTasks do
            taskAgent.Post message

          let recurringTasks = 
            !recurringTasks
            |> List.map (fun (time,recurringRate,message) ->
                if time <= currentTime then
                  taskAgent.Post message
                  currentTime + recurringRate,recurringRate,message
                else
                  time,recurringRate,message)
                    
          if not (List.isEmpty rest && List.isEmpty recurringTasks) && 
            agent.CurrentQueueLength = 0 
          then 
            agent.Post(Sleep refreshRate)

          return! loop rest recurringTasks  }

    loop [] [])
