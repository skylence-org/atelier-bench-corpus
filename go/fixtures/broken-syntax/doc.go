// Package brokensyntax holds intentionally invalid Go source used as parser
// negative cases. The two broken files carry the `brokenfixtures` build tag,
// so the normal build and vet never see them; this file is the only one that
// compiles, and it exists so `go build ./...` has a package to build here.
//
// Do not fix the broken files.
package brokensyntax

// Marker is here so the package is not empty.
const Marker = "broken-syntax fixtures; do not fix"
