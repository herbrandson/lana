To start the code run the following from a terminal
```
# install dependencies
npm install

# run the tests
npm test

# run the web server
npm start
```

The web server will run on port 1976. You can test the api using a curl command similar to the following
```
curl -X POST http://localhost:1976/checkout \
  -d '{
	"120P90": 1,
	"43N23P": 2
}'
```


Some comments:
* This is a very simple implementation. I have generally optimized for readability over performance or scaleability
* I wanted the promotions to be data driven. The idea is that you would simply update a database to edit, add, or delete promotions. I don't 100% love the way this came out, but I do like the general concept of promotions being data driven so that new promotions don't require changes to code
* There are some issues that I've glossed over here for the sake of simplicity. For example, what if there are multiple promos that could be applied to a cart for the same items? This code will apply all of them. In the real world, we would likely need to select only one (perhaps the highest value one?)
* In a full application I wouldn't write error handling into each route. Instead, I'd have some sort of global error handler registered in express. But for simplicity/readability sake for this exercise I just placed it in the one route handler.
* I placed all of the code in a single file (index.js), again for simplicity. In a real application I'd likely split at least the database access code into a separate file.
