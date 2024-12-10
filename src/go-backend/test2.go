package main


//More go testing functions
import (
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestHashPassword(t *testing.T) {
	user := &User{}
	password := "SecureP@ssw0rd"

	// Hash the password
	err := user.HashPassword(password)
	if err != nil {
		t.Fatalf("Error hashing password: %v", err)
	}

	// Ensure the hashed password is not the same as the plain text
	if user.Password == password {
		t.Errorf("Hashed password should not match the plain-text password")
	}
}

func TestCheckPassword(t *testing.T) {
	user := &User{}
	password := "SecureP@ssw0rd"

	// Hash the password
	err := user.HashPassword(password)
	if err != nil {
		t.Fatalf("Error hashing password: %v", err)
	}

	// Check the password with the correct value
	if !user.CheckPassword(password) {
		t.Errorf("Expected CheckPassword to return true for correct password")
	}

	// Check the password with an incorrect value
	if user.CheckPassword("WrongP@ssword") {
		t.Errorf("Expected CheckPassword to return false for incorrect password")
	}
}

func TestUserInitialization(t *testing.T) {
	user := &User{
		ID:                   primitive.NewObjectID(),
		ProfilePicture:       "https://example.com/profile.jpg",
		Role:                 "user",
		Username:             "testuser",
		Email:                "testuser@example.com",
		Verified:             false,
		VerificationCode:     "123456",
		Likes:                []primitive.ObjectID{},
		Dislikes:             []primitive.ObjectID{},
		Saved:                []primitive.ObjectID{},
		Comments:             []Comment{},
		Followers:            []primitive.ObjectID{},
		Following:            []primitive.ObjectID{},
		ResetPasswordToken:   "",
		ResetPasswordExpires: time.Time{},
	}

	if user.ID.IsZero() {
		t.Errorf("Expected ID to be initialized, but it is zero")
	}

	if user.ProfilePicture != "https://example.com/profile.jpg" {
		t.Errorf("Expected ProfilePicture to be 'https://example.com/profile.jpg', got %s", user.ProfilePicture)
	}

	if user.Role != "user" {
		t.Errorf("Expected Role to be 'user', got %s", user.Role)
	}

	if user.Verified {
		t.Errorf("Expected Verified to be false, got true")
	}

	if user.VerificationCode != "123456" {
		t.Errorf("Expected VerificationCode to be '123456', got %s", user.VerificationCode)
	}
}