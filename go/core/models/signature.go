package models

// Signature is the collection signature on a completed repair.
type Signature struct {
	ID            int
	RepairOrderID int
	SignedBy      string
	Witnessed     bool
}

// NewSignature builds an unwitnessed signature.
func NewSignature(id int, repairOrderID int, signedBy string) *Signature {
	return &Signature{ID: id, RepairOrderID: repairOrderID, SignedBy: signedBy}
}

// IsValid is true once somebody signed.
func (s *Signature) IsValid() bool {
	return s.SignedBy != ""
}
