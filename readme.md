### Base62 conversion concept
- 6 digit random code from string "ABCDEFGHIJKLMNOPQRTSUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
- check if code exists in db
- if not map it to the long url
- if yes - regenerate another shortcode
- easy 

### Unique Key -> Non Unique Value 
- xyz123 -> google.com
- abc345 -> google.com 
- notice shortcode key are always unique and can point to single value. 

 ### weird facts I didn't know
 - node_modules folder is supposed to stay outside the src folder.
 - if res.redirect(302, destinationUrl) : this destination url needs to have https / http otherwise express will consider it internal and will merge the current_route/destinationUrl : which is not valid obviously
