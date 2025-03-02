'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { liveblocks } from "../liveblocks";
import { parseStringify } from "../utils";

export const getClerkUsers = async ({userIds}: {userIds: string[]}) => {
    try {
        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds,
        })

        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));

        const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));
        return parseStringify(sortedUsers);
        
    } catch (error) {
        console.error(`Error happened while fetching users: ${error}`);
    }
};

export const getDocumentUsers = async ({roomId, currentUser, text}: {roomId: string, currentUser: string, text: string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        const users = Object.keys(room.usersAccesses).filter((user) => user !== currentUser);

        if(text.length > 0) {
            const lowerCaseText = text.toLowerCase();
            const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText));
            return parseStringify(filteredUsers);
        }

        return parseStringify(users);
    } catch (error) {
        console.error(`Error happened while fetching users: ${error}`);
    }
};