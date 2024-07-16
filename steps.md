# userPresence.js
  <!-- - Add the ability to enter and leave presence set
    - add utility functions for this
  - Clean up the code and review everything

# usePresenceListener
  - Clean up code
  - Double check to make sure everything works

# useChannel Hook
  - review this hook and clean it up 
  - review the callback function and how it is handling the data
    - Rework this if needed

# Add Error handling
  - Look into returning errors to the client if the user can't do the following
    - enter a presence set
    - leave a presence set
    - update their information -->

# Connection State Recovery
  - How do I want to handle this?
  - Initial Steps
    - When a user temporary disconnects & connection state recovery is started
      - Need to emit to store the user's information with a TTL 
        - The TTL will match the same time as socket.io settings
      - Unsubscribe the user from all the current channels
      - We emit that the user unsubscribes to all the other users
    - If the user does not reconnect within the specified time frame
      - the information will be deleted
    - Else
      - we remove the TTL from the information
      - We remit to everyone that he has rejoined
      - socket.io should already handle the resubscribing of rooms
  
    - Stuff to consider
      - We ned atomic operations
        - so we can use multi, to make sure they are all executed at the same time
        - we do not have race conditions
      - How do we handle if the user disconnects and reconnects super fast
        - is this going to blow the system up?
        - maybe use Watch and UNWatch
      - How do we handle rapid reconnect handling
        - I looked up debounce logic to ensure that the reconnection logic is only started when the connection stabilizes 
      - Do we need indexes for redis?
        - This can speed up our query times. Do we really need them though

# Clean up the code 
  - If the room is empty, then remove the room from the presence set

# Occupancy
  - Need a way to track the number of people in the presence set
  - Maybe add the ability to see the total number of connections?
  
# Make sure it works with the cdk
  - Validate that the application can work with the elasticache, and it has the permissions
# Clean up the css
# Test changing the username

# How to handle when a server goes down
  - 