### 1. Room Entrance fot the first time:

<p> 
1. When entering the room for the first time, we call @function joinAndFetchMessages in order to load
all the messages from Backend and save it locally in redux.
2. When ever the app has been killed and all the rooms have been reloaded from the Backend, we mark all the rooms as not seen yet. 
-> /ChatRoomSlice -> reducer roomsData

3. When entering those rooms, we fetch their messages from BE again and save them again in redux
-> /ChatRoomSlice -> reducer roomsMessages
</p>

### 2. Room Entrance for subsequent times:
<p> 
1. When we entering the room for the first time, we mark the room as seen.
2. When navigating away from the room while the app is still in the forground or in the background, and reenter the room
we do not refetch messages from BE. We retrieve them rightaway from Redux so that it will be instantly displayed.
-> /ChatRoomSlice -> reducer roomsMessages
</p>

### 3. Logged-in user send out new conversation:
<p>
*When the logged in user sends out a messages via the @function handleSubmitAsync, we ...
1. add the message to redux so that it gets instantly displayed to the logged in user. This message has a self-generated uuid.
-> /ChatRoomSlice -> reducer addNewMessage

2. compile the message body that gets sent to the BE
3. Clear the textInput field and its value 
4. Post the message to BE
5. When BE gives us a response, we update the message uuid in redux with the correct uuid received from BE. 
-> /ChatRoomSlice -> reducer updateSuccessfullySentMessage

6. We receive a new message push event via pusher where we perform following action: 
    6.1 We are the sender of the message 
    ? do not add the message to redux because it was already added to redux
    : add the message to redux (-> /ChatRoomSlice -> reducer addNewMessage)
</p>

### 4.Logged-in user send out new reply:
<p>
1. In order to send out a reply, the logged-in user has to tap on a thread 👆
2. When tapping on a thread, the @function handleMessageSelected gets called
3. The @function handleMessageSelected passes over the thread index 
([...3...]) -> thread index

* When the user sends out a reply via the @function handleSubmitAsync, we ...
4. Find the thread index and add the reply to redux so that it gets instantly displayed to the logged in user. 
This reply has a self-generated uuid.
-> /ChatRoomSlice -> reducer addNewMessage

5. compile the reply body that gets sent to the BE
6. Clear the textInput field and its value 
7. Post the reply to BE
8. When BE gives us a response, we update the reply uuid in redux with the correct uuid received from BE. 
-> /ChatRoomSlice -> reducer updateSuccessfullySentMessage

9. We receive a new reply push event via pusher where we perform following action: 
    6.1 We are the sender of the reply 
    ? do not add the reply to redux because it was already added to redux
    : add the reply to redux (-> /ChatRoomSlice -> reducer addNewMessage)
</p>

### 5. New conversation/reply arrives via Pusher:
<p>
1. When a new message arrives via pusher , the @function addMessage gets called
2. The @function addMessage sends the message to redux only for users who are not the sender of the message
-> /ChatRoomSlice -> reducer addMessage

3. In Redux we have to distingiush if the new message is a new conversation or a new reply
  -> check if the message has a parent message
  ? the message is a reply
  : the message is a new conversation

4. -> The message is a reply 
    ? Post the reply as the last message of the thread
    : start a new thread by posting the thread as the last thread of the thread/message list


</p>

### 9. Logged-in user tap on "scroll helper button" to see the new reply:
* The NavigationHelperButton enables the user to scroll to all new replies which he has not seen yet
1. Upon entering the room, we search in the entire message list for replies which the user has not seen yet 
and store them in a list
-> /ChatRoomUtilities -> function getRepliesList

2. The NavigationHelperButton holds a list of all thread ids which contain replies which the user has not seen yet
[3818, 3337, 2798 ...] -> ids of threads which we call repliesList

3. When clicking on the button , the @function goToIndex gets called
4. The @function goToIndex searches for the index in Redux of the first element in the repliesList 
[(3818), 3337, 2798 ...] -> search for index of (3818) in the roomsMessages list

5. Scroll the user to found index
6. Mark the reply we scrolled to as seen
7. Update repliesList

### 10. Logged-in user tap on "scroll down button" to get back to the very bottom of the list:
* The NavigationHelperButton transforms into a scroll down button when the user does not have any replies which he has not seen yet. 
1. When clicking on it, the user gets scrolled to the bottom of the screen

### 11. Logged-user typing message to reply to someone, how is the target reply is avoided ? i.e. how is the textinput shifted down?:

### 12. Logged-in user tap on a message to reply and keyboard appears:
1. When tapping on a message, we retrieve the id of that thread and save it in a state so called parentMessageId
2. In a useEffect we listen for a change of state of parentMessageId
3. Once the state changed, we trigger to open the keyboard

### 13. Logged-in user enters the room via invite link:
1. When a user opens up the app via an invite link, we detect that it was opened via a firebase dynamic invite link 
-> /ChatRoomManager -> function handleDynamicLink

2. When the app was opened via a link, we trieve the roomId from the link
3. We refetch all the rooms and navigate the user to that room
-> /ChatRoomManger -> function getRoomByLink

### 14. A user is blocked in the room:
1. When a user gets blocked from the room, we receive a push event that a member has been removed
-> /UserFeedPusherListener || /PublicPusherListeners -> function removeMember

2. From the @function removeMember, we ...
  2.1 refetch all the rooms
  2.2 refetch messages of the room the blocked member has been removed from. 

### 15. The messages in a room are rendered in an inverted list:
1. All the messages trieved from BE are sorted in DESC order
2. An inverted Flatlist renders the last items in a list first and starts automattically on the last item of the list
3. When entering the room, we don't have to scroll the user to the last message of the list because the inverted list starts at the last message of the list