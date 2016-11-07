## Shout Box
- This program is deployed on http://shoutbox.wangyn.net/
- This program is called shoutbox. Everyone registered can send a message with a title which can be anything you wanna say, like weather, news or mood.
- It is a example for exercising the Express, a HTTP framework, in the book called "Node.js in Action" authored by Mike　Cantelon, Marc Harter.
- I got it and deployed it to my vps. If someone is interested in it, access [here](http://shoutbox.wangyn.net/) and register an account. Then you can login this site to post messages or to scan others' talks.
  
### features
- The token session of login module is stored in redis.
- The user object(including name, password, id) is stored in a hash table of keys to values.
- The entry objects(including title, body, username) is stored in a list.
- Use bootstrap to beautify web pages.

### licence
MIT