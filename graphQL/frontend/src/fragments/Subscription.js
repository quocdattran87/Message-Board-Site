const subscription = (setMessage) => {
        // Reference: https://www.the-guild.dev/graphql/yoga-server/docs/features/subscriptions
        const url = new URL('http://localhost:4000/graphql')
 
        url.searchParams.append(
        'query',
        /* GraphQL */ `
          subscription Test {
            post {
              mutation
              data {
                id
                dislikes
              }
            }
          }
        `
        )
        url.searchParams.append('variables', JSON.stringify({ from: 10 }))
        
        const eventsource = new EventSource(url.href, {
          withCredentials: true // This is required for cookies
        })
        
        eventsource.onmessage = (event) => {
          // const data = JSON.parse(event.data)
          // console.log(data)
          setMessage(<>My spidey senses are tingling!</>)
        }
}