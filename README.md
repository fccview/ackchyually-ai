# Ackchyually it's AI

Lately I have been using AI more and more in my codebase and that's been a bit of a hit and miss if you ask me.

I reckon it's an amazing tool that allows developers to truly optimise their workflow, however at times laziness take over and code reviews are not as frequent as they should be.

I have decided to NOT use AI in the build of this project, everything has been done the good old way, and to celebrate it, I went for a technology I hadn't used in a decade: `jQuery`!

Everything is as simple as it gets, it's a good old regex based scan looking for a hardcoded set of patterns that are likely to be found in AI generated code.

For styling I went with good old simple css, using a mix of pastel colours, and starting off from an AMAZING CSS library I found: [oxalorg/sakura](https://github.com/oxalorg/sakura). A huge thank youh to [@oxalorg](https://github.com/oxalorg) for this incredibly pretty library.

## Want to self host?

Oh come on, just pull the repo and click on the `index.html` file, easy peasy. 

If you REALLY want to use docker for this... you may have a serious addiction... just like me! Here's a simple `docker-compose.yml` file!

```yaml
version: '3'
services:
  web:
    image: nginx:alpine
    ports:
      - "1234:80"
    volumes:
      - ./:/usr/share/nginx/html
```

You obviously need to pull the repo, I am NOT making a docker image for this.

