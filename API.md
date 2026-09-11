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
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# User Router
- GET /user/connections
- GET /user/request/received
- GET /user/feed
