import express from 'express'
import {
    handleFriendRequestSent,
    handleFriendRequestResponse,
    handleFriendDeletion,
    handleGetFriends
} from '../controllers/friendsController.js'

const router = express.Router()

router.post('/send-friend-request', handleFriendRequestSent)

router.post('/respond-friend-request', handleFriendRequestResponse)

router.post('/remove-friend', handleFriendDeletion)

router.get('/get-friends/:status/:userId', handleGetFriends)

export default router