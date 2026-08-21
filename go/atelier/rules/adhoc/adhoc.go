// Package adhoc holds the 24 STRUCTURAL rules: values of one struct type
// whose check is a closure. Nothing in this package names RuleContract, and
// no compile-time assertion appears anywhere; the values satisfy the rule
// method set by shape alone.
package adhoc

import (
	"strings"

	"atelier.example/lane/atelier/dataset"
)

// AdHocRule is a rule expressed as data plus a closure, not as a type.
type AdHocRule struct {
	key   string
	check func(data *dataset.Dataset) bool
}

// Key is the rule identifier.
func (r AdHocRule) Key() string {
	return r.key
}

// Evaluate runs the closure.
func (r AdHocRule) Evaluate(data *dataset.Dataset) bool {
	return r.check(data)
}

// Rules are the 24 structural rules, in declaration order.
var Rules = []AdHocRule{
	{key: "duplicate-reference", check: func(data *dataset.Dataset) bool {
		seen := map[string]bool{}
		for _, order := range data.Orders {
			seen[order.Reference()] = true
		}
		return len(seen) == len(data.Orders)
	}},
	{key: "reference-prefix", check: func(data *dataset.Dataset) bool {
		for _, order := range data.Orders {
			if !strings.HasPrefix(order.Reference(), "AT-") {
				return false
			}
		}
		return true
	}},
	{key: "currency-consistency", check: func(data *dataset.Dataset) bool {
		for _, invoice := range data.Invoices {
			if invoice.Total.Cents() < 0 {
				return false
			}
		}
		return true
	}},
	{key: "rounding", check: func(data *dataset.Dataset) bool {
		return data.PartsCostCents()%1 == 0
	}},
	{key: "tax-applied", check: func(data *dataset.Dataset) bool {
		return data.RevenueCents() > data.PartsCostCents()
	}},
	{key: "export-freshness", check: func(data *dataset.Dataset) bool {
		return len(data.Orders) > 0
	}},
	{key: "notification-sent", check: func(data *dataset.Dataset) bool {
		return len(data.CompletedOrders()) > 0
	}},
	{key: "audit-trail", check: func(data *dataset.Dataset) bool {
		for _, order := range data.Orders {
			if len(order.Log) > 0 {
				return true
			}
		}
		return false
	}},
	{key: "cache-ttl", check: func(data *dataset.Dataset) bool {
		return len(data.Parts) > 0
	}},
	{key: "report-coverage", check: func(data *dataset.Dataset) bool {
		return len(data.Customers) > 0
	}},
	{key: "metric-range", check: func(data *dataset.Dataset) bool {
		return data.LabourMinutes() >= 0
	}},
	{key: "dataset-integrity", check: func(data *dataset.Dataset) bool {
		return len(data.Devices) == len(data.Customers)
	}},
	{key: "seed-determinism", check: func(data *dataset.Dataset) bool {
		return data.RevenueCents() == 58325
	}},
	{key: "order-count", check: func(data *dataset.Dataset) bool {
		return len(data.Orders) == 4
	}},
	{key: "customer-count", check: func(data *dataset.Dataset) bool {
		return len(data.Customers) == 3
	}},
	{key: "part-count", check: func(data *dataset.Dataset) bool {
		return len(data.Parts) == 4
	}},
	{key: "invoice-count", check: func(data *dataset.Dataset) bool {
		return len(data.Invoices) == 2
	}},
	{key: "open-order-ratio", check: func(data *dataset.Dataset) bool {
		return float64(len(data.OpenOrders()))/float64(len(data.Orders)) <= 1
	}},
	{key: "completion-rate", check: func(data *dataset.Dataset) bool {
		return float64(len(data.CompletedOrders()))/float64(len(data.Orders)) >= 0.25
	}},
	{key: "average-ticket", check: func(data *dataset.Dataset) bool {
		return float64(data.RevenueCents())/float64(len(data.Orders)) > 0
	}},
	{key: "parts-per-order", check: func(data *dataset.Dataset) bool {
		lines := 0
		for _, order := range data.Orders {
			lines += len(order.Parts)
		}
		return lines >= 4
	}},
	{key: "repeat-customer", check: func(data *dataset.Dataset) bool {
		for _, customer := range data.Customers {
			if len(data.OrdersOf(customer.ID)) > 1 {
				return true
			}
		}
		return false
	}},
	{key: "device-category", check: func(data *dataset.Dataset) bool {
		for _, device := range data.Devices {
			if len(device.Brand) == 0 {
				return false
			}
		}
		return true
	}},
	{key: "inventory-turnover", check: func(data *dataset.Dataset) bool {
		for _, part := range data.Parts {
			if part.ConsumedQuantity() >= 0 {
				return true
			}
		}
		return false
	}},
}
