# API Planning


# Auth Router
- POST /signup
- POST /login
- POST /logout

# profile Router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# request Router
- POST /request/send/interested/:userId
- POST/request/send/ignored/:userId

-----> We will make a dynamic api for intrested or ignored 
 - POST /request/send/:status/:toUserId


- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

-----> We will make a dynamic api for accepted or rejected 
 - POST /request/review/:status/:requestId

# User Router
- GET /user/connections
- GET /user/requests/received
- GET /user/feed
