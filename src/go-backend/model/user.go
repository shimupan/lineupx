package main

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User struct representing the MongoDB User document
type User struct {
	ID                   primitive.ObjectID   `bson:"_id,omitempty"`          			// MongoDB ObjectID
	ProfilePicture       string               `bson:"profilePicture"`      			    // Profile picture URL
	Role                 string               `bson:"role"`                   			// User role (default: "user")
	Username             string               `bson:"username"`               			// Unique username
	Email                string               `bson:"email"`                  			// Unique email address
	Password             string               `bson:"password"`               			// Hashed password
	Verified             bool                 `bson:"verified"`               			// Email verification status
	VerificationCode     string               `bson:"verificationCode"`       			// Email verification code
	Likes                []primitive.ObjectID `bson:"likes,omitempty"`        			// Liked posts
	Dislikes             []primitive.ObjectID `bson:"dislikes,omitempty"`     			// Disliked posts
	Saved                []primitive.ObjectID `bson:"saved,omitempty"`        			// Saved posts
	Comments             []Comment            `bson:"comments,omitempty"`     			// User comments
	Followers            []primitive.ObjectID `bson:"followers,omitempty"`    			// Followers
	Following            []primitive.ObjectID `bson:"following,omitempty"`    			// Following users
	ResetPasswordToken   string               `bson:"resetPasswordToken"`     			// Password reset token
	ResetPasswordExpires time.Time            `bson:"resetPasswordExpires"`   			// Password reset expiration
}

// Comment struct for user comments
type Comment struct {
	Text      string             `bson:"text"`                 // Comment text
	CreatedAt time.Time          `bson:"createdAt"`            // Creation timestamp
	Post      primitive.ObjectID `bson:"post,omitempty"`       // Associated post
}

// HashPassword hashes the user's password before saving
func (u *User) HashPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// CheckPassword compares a plain-text password with the hashed password
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}
