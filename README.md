# MinimalFableSuave

## Build

You can run `build.cmd` to run the web site:

	* starts suave.io webserver
	* opens browser on http://localhost:8083 
	* watches for changes in the solution and rebuilds 

There is also a Visual Studio solution which can be started with <kbd>F5</kbd> and allows debugging.

## Service Installation

* Run the build 
* Copy bin folder to target machine
* Install Service with `MinimalFableSuave.exe install` (in admin mode)

## Service Start and stop

* Start Service with `MinimalFableSuave.exe start` (in admin mode)
* Stop Service with `MinimalFableSuave.exe stop` (in admin mode)

## Debugging
1. In Visual Studio set a holding point
2. Start Debugging with <kbd>F5</kbd>
 
## Used technology

For the webpage following technologies got used

- DotLiquid Templating
- [Paket](https://fsprojects.github.io/Paket/)
- [FAKE](http://fsharp.github.io/FAKE/)
- [Fable](https://fable-compiler.github.io/)
- [Suave](http://suave.io/)
- [Topself](https://github.com/haf/Topshelf.FSharp)

## Resources

Used Demo applications:

- FsSnip: [Gihub-Project](https://github.com/tpetricek/FsSnip.Website)
- Forki's advent post: [Automatic re-build and background tasks for suave.io websites](http://www.navision-blog.de/blog/2015/12/)