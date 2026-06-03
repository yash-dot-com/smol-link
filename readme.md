### architecture 
<img width="804" height="480" alt="image" src="https://github.com/user-attachments/assets/3d86b942-a045-4afa-8496-f09976199719" />

### visual documentation 
<img width="807" height="695" alt="image" src="https://github.com/user-attachments/assets/7dc3a68b-1083-4259-87e9-ac0aba54d056" />

### using curl instead of bloated postman
<img width="907" height="450" alt="image" src="https://github.com/user-attachments/assets/d4491a75-0f12-4a5c-92e1-c9527b13db6d" />

### route implementation for generating unique shortCode
<img width="1054" height="554" alt="image" src="https://github.com/user-attachments/assets/ad7b6c7c-24d4-4f28-92b4-30d2591cf8b6" />

 ### learnings
 - learnt to setup and configure drizzle-kit for generating SQL from drizzle-orm code & migrating (pushing) the SQL to database
 - learnt JWT based simple session management
 - learnt using drizzle-orm's sql-like-api for querying data instead of raw SQL (more productive and lesser error prone)
 - base62 concept - its so basic but yeah
 - learnt how url shortener hashes and settles collisions if more than 2 users want to shorten same URL
 - when same repository has 2 different commit histories, remote - different, local - different and we want to keep changes and work from both of them, we do git pull rebase

### git rebase
- git pull origin main --rebase
```
Remote : A --- B (README commit)
Local : A --- C (bugfix commit)
After rebase : A --- B --- C
```

### Base62 conversion
- 6 digit random code from string "ABCDEFGHIJKLMNOPQRTSUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
- check if code exists in db
- if not map it to the long url
- if yes - regenerate another shortcode
- easy 

### Unique Key -> Non Unique Value 
- xyz123 -> google.com
- abc345 -> google.com 
- notice shortcode key are always unique and can point to single value. 

### Dumb things I found out
- learnt how to actually use git productively
- learnt how to structure project from first principles
- learnt creation of custom scripts for project setup, utility (npx drizzle-kit generate / migrate) etc
- learnt using CURL instead of postman
- node_modules folder is supposed to stay outside the src folder.
- if res.redirect(302, destinationUrl) : this destination url needs to have https / http otherwise express will consider it internal and will merge the current_route/destinationUrl : which is not valid obviously

### what to improve
- make this deployable
- make a frontend
- implement testing
- caching is not yet implemented with redis
