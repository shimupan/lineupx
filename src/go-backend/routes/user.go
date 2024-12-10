package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// MongoDB client
var client *mongo.Client

// Connect to MongoDB
func connectDB(uri string)(*mongo.Client, context.Context, 
	context.CancelFunc, error) {
	
	// ctx will be used to set deadline for process, here 
	// deadline will of 30 seconds.
	ctx, cancel := context.WithTimeout(context.Background(), 
					30 * time.Second)

	// mongo.Connect return mongo.Client method
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	return client, ctx, cancel, err
}

// Disconnect from MongoDB
func closeDB(client *mongo.Client, ctx context.Context,
	cancel context.CancelFunc){
		
	// CancelFunc to cancel to context
	defer cancel()

	// client provides a method to close 
	// a mongoDB connection.
	defer func(){
		// client.Disconnect method also has deadline.
		// returns error if any,
		if err := client.Disconnect(ctx); err != nil{
			panic(err)
		}
	}()
}

//Ping mongoDB for connection check
func ping(client *mongo.Client, ctx context.Context) error{

    // mongo.Client has Ping to ping mongoDB, deadline of 
    // the Ping method will be determined by cxt
    // Ping method return error if any occurred, then
    // the error can be handled.
    if err := client.Ping(ctx, readpref.Primary()); err != nil {
        return err
    }
    fmt.Println("connected successfully")
    return nil
}

// Get user by username handler
func getUserHandler(w http.ResponseWriter, r *http.Request) {
	username := mux.Vars(r)["id"]
	currentUserName := r.URL.Query().Get("CurrentUser")
	params := strings.Split(r.URL.Query().Get("Params"), ",")

	defaultParams := []string{"username", "profilePicture"}
	userOnlyParams := []string{"email", "verificationCode"}
	bannedParams := []string{"password"}
	sameUser := currentUserName == username

	// Include permitted params
	for _, param := range params {
		if contains(bannedParams, param) {
			continue
		}
		if !sameUser && contains(userOnlyParams, param) {
			continue
		}
		defaultParams = append(defaultParams, param)
	}

	// Construct projection for MongoDB query
	projection := bson.M{}
	for _, field := range defaultParams {
		projection[field] = 1
	}

	//Fix
	collection := client.Database("testdb").Collection("users")
	var user User
	err := collection.FindOne(context.TODO(), bson.M{"username": username}, options.FindOne().SetProjection(projection)).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(user)
}

// Utility function to check if an array contains a specific string
func contains(slice []string, item string) bool {
	for _, v := range slice {
		if v == item {
			return true
		}
	}
	return false
}

//Added jwtValidation backend reworked function in go
func jwtMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        tokenString := r.Header.Get("Authorization")
        if tokenString == "" {
            http.Error(w, "Authorization token missing", http.StatusUnauthorized)
            return
        }

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            // Validate signing method and return secret key
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method")
            }
            return []byte("your-secret-key"), nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func uploadProfilePictureHandler(w http.ResponseWriter, r *http.Request) {
    // Parse the form data
    r.ParseMultipartForm(10 << 20) // Max 10MB
    file, handler, err := r.FormFile("image")
    if err != nil {
        http.Error(w, "Error processing file", http.StatusBadRequest)
        return
    }
    defer file.Close()

    // Upload to Cloudinary (use a library or HTTP request)
    tempFile, err := os.CreateTemp("uploads", "profile-*"+filepath.Ext(handler.Filename))
    if err != nil {
        http.Error(w, "Error creating temp file", http.StatusInternalServerError)
        return
    }
    defer os.Remove(tempFile.Name())

    io.Copy(tempFile, file)
    // Need to add cloudinary unpload here

    fmt.Fprintf(w, "File uploaded successfully: %s\n", tempFile.Name())
}

//Converted followUser api call to go
func followUserHandler(w http.ResponseWriter, r *http.Request) {
    userID := mux.Vars(r)["id"]
    followerID := r.URL.Query().Get("follower")

    collection := client.Database("testdb").Collection("users")
    _, err := collection.UpdateOne(context.TODO(),
        bson.M{"_id": userID},
        bson.M{"$addToSet": bson.M{"followers": followerID}})
    if err != nil {
        http.Error(w, "Failed to follow user", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
}

func main(){

    // Get Client, Context, CancelFunc and 
    // err from connect method.
    if err != nil 
    {
        panic(err)
    }
    
    // Release resource when the main
    // function is returned.
    defer close(client, ctx, cancel)
    
    // Ping mongoDB with Ping method
    ping(client, ctx)
}

func main() {
	
    client, ctx, cancel, err := connectDB("mongodb://localhost:1337")
	defer func() {
		if err != nil {
			panic(err)
			log.Fatalf("Failed to disconnect MongoDB client: %v", err)
		}
	}()

	r := mux.NewRouter()
	r.HandleFunc("/users", userLoginHandler).Methods("POST")
	r.HandleFunc("/user/{id}", getUserHandler).Methods("GET")

	fmt.Println("Server is running on port 1337")
	log.Fatal(http.ListenAndServe(":1337", r))

	//When main ends close the server
	defer closeDB(client, ctx, cancel)
    
    // Ping mongoDB with Ping method
    ping(client, ctx)
}
