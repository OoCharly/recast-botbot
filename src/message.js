/*
* message.js
* This file contains your bot code
*/

const recastai = require('recastai')
const weather = require('./weather')

// This function is the core of the bot behaviour
const replyMessage = (message) => {
	// Instantiate Recast.AI SDK, just for request service
	const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
	// Get text from message received
	const text = message.content

	console.log('I receive: ', text)

	// Get senderId to catch unique conversation_token
	const senderId = message.senderId

	// Call Recast.AI SDK, through /converse route
	request.converseText(text, { conversationToken: senderId })
	.then(result => {
		/*
		* YOUR OWN CODE
		* Here, you can add your own process.
		* Ex: You can call any external API
		* Or: Update your mongo DB
		* etc...
		*/
		if (result.action) {
			console.log('The conversation action is: ', result.action.slug)
		}

		// If there is not any message return by Recast.AI for this current conversation
		if (result.replies.length){
			// Add each reply received from API to replies stack
			result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }))
		}
		// Send all replies
		message.reply().then(() => {
			if (result.action && result.action.done){
				if (result.action.slug === 'weather') {
					var place = result.getMemory('place')
					weather(place.lat, place.lng, place.formatted).then( (res) => {
						message.addReply(res)
						message.addReply({
							type: 'quickReplies',
							content: {
								title: 'Would you like me to check for another place ?',
								buttons: [
									{
										title: 'Yes',
										value: 'weather',
									},
									{
										title: 'No',
										value: 'Bye'
									}
								]
							}
						})
						return message.reply()
					})
				}else if (result.action.slug === 'help'){
					message.addReply({ type:'text', content:'My main function is to check the weather in a given place!\n' +
				'Try it! Type "Is it sunny in Mexico ?"\n' +
				'I can also give you some informations and contact details about my creator'})
					return message.reply()
				}else if (result.action.slug === 'creator'){
					message.addReply({
						type: 'quickReplies',
						content: {
							title: 'Would you like his informations ?',
							buttons: [
								{
									title: 'Yes',
									value: 'details',
								},
								{
									title: 'No',
									value: 'no'
								}
							]
						}
					})
					return message.reply()
				}else if (result.action.slug === 'details'){
					message.addReply({
						type: 'card', content:{
						title: 'Charles-Henry Desvernay',
						subtitle: '06********',
						imageUrl: '../img/id.jpg',
						buttons: [
							{
								title: 'Github',
								type: 'web_url',
								value: 'https://github.com/OoCharly'
							}]
						}})
						return message.reply()
					}}})
					.catch(err => {
						console.error('Error while sending message to channel', err)
					})
				})
				.catch(err => {
					console.error('Error while sending message to Recast.AI', err)
				})
			}

			module.exports = replyMessage
