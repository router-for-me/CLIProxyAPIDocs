package main

import "flag"

func main() {
	var codexLogin bool
	flag.BoolVar(&codexLogin, "codex-login", false, "Login to Codex using OAuth")
}
