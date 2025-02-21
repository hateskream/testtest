package main

import "testing"

func TestHello(t *testing.T) {
	if 1+1 != 2 {
		t.Errorf("Math is broken!")
	}
}
