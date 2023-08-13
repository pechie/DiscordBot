# DiscordBot
Discord bot to start/stop a minecraft server hosted on AWS

## Background
My friends and I recently began playing minecraft, and were quickly confronted by the issue of needing to create a server to play together.
After 30 minutes of research, and some trial and error, we were able to locally host a server that the 3 of us could play together on.
This was a fine setup, but had some glaring potential issues.
  1. If friend A owns the server on his local machine, friends B and C cannot play unless friend A is present.
  2. Any internet outage or dip in upload speed could kick us off the server at any time.

I decided I would try to remedy these issues by creating and hosting a server on AWS, and creating a discord bot with commands that would allow any of us to start and stop the server as we please.

## Design
For the server itself, I created an EC2 instance in AWS, and SSH'd onto the instance to setup the server just as we had locally. This allowed me to join the minecraft server after manually running the server.jar file.
I then wrote a script that would automatically start the server whenever the EC2 instance started, and properly shutdown the server when the instance was stopped. This would be useful once we implemented the discord bot into the design, as it would only need to start the instance itself.
In order to connect to a minecraft server, you need its IP address, so I used Elastic IP to attach a static IP to the instance.

Once this was done and tested, I moved on to creating a discord bot that was capable of starting and stopping the server using slash commands. I began by creating the bot in the Discord Developer Portal, and after specifying what permissions I wanted the bot to have, I was able to invite the not-yet-functional bot into a discord server that I had created. 
I then needed to provide an endpoint for the bot to interact with, and a lambda function to handle all of the slash commands. I did this by creating a lambda function that contained the code for connecting to the EC2 instance, as well as handlers for each of the bot's commands. Next I added an api endpoint as the trigger for this lambda, and specified this url as the 'Interactions Endpoint URL' for the discord bot in the developer portal.

Although the code was deployed to the lambda function, the last step was to register these commands through the discord api. By specifying the ID of the bot, as well as the ID of the server I had created, I was able to make POST requests to the discord API to register each of the commands I wanted the bot to use.

## Current bot commands
- /ip : Prints out the IP address of the server
- /start : Starts the minecraft server
- /stop : Shuts down the minecraft server

## Future Improvements
- There is a small charge incurred by AWS for using an Elastic IP that is attached to a non-running instance, so in order to keep costs down, I would like to use a dynamic IP for this instance, and add a command in the discord bot that would print out the current IP address of the instance.
- In case someone forgets to stop the server when they are done playing, I would like to create a script that will periodically check if anyone is connected to the server, and if nobody is connected for 30 minutes, the instance will automatically shutdown.
