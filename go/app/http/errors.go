package http

import (
	"net/http"

	"atelier.example/lane/core/failure"
)

// ErrorView is the payload of every failed request.
type ErrorView struct {
	Error string `json:"error"`
	Key   string `json:"key"`
}

// writeError maps a domain error to a status code. errors.Is sees through the
// wrapping to the sentinel; errors.As recovers the missing key.
func writeError(writer http.ResponseWriter, err error) {
	status := http.StatusInternalServerError
	if failure.IsNotFound(err) {
		status = http.StatusNotFound
	}
	key, _ := failure.MissingKey(err)
	writeJSON(writer, status, ErrorView{Error: err.Error(), Key: key})
}
