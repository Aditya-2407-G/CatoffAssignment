import { Alert } from "react-native";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {

    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    gameCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GAME_COLLECTION_ID,
    storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID,
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
export const storage = new Storage(client);


export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) {
            throw new Error(error);
        }

        const avatarUrl = avatars.getInitials(username);

        await Signin(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountid: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function Signin(email, password) {
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountid", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return {
            currentAccount, 
            userDocument: currentUser.documents[0]
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function siguOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}   

export async function changePassword(newPassword, currentPassword) {
    try {
        const response = await account.updatePassword(newPassword, currentPassword); 
        return response;
    } catch (error) {
      throw new Error(error);
    }
}


export async function createGame(gameData) {
    try {

        const { title, description, type, startDate, endDate, participants, userDetails, image } = gameData;

        const filename = image.fileName;
        const mimeType = image.mimeType;
        const fileSize = image.fileSize;
        const uri = image.uri;

            const uploadImage = await uploadFile(filename, mimeType, fileSize, uri);

            if(!uploadImage) throw new Error("Failed to upload image")

                const imageId = uploadImage.$id;

            const uploadedFile = await getUploadedFile(imageId);
            const uploadedFileURI = uploadedFile.href;

            const newGame = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.gameCollectionId,
                ID.unique(),
                {
                    title,
                    description,
                    type,
                    startDate,
                    endDate,
                    participants,
                    userDetails,
                    image: uploadedFileURI
                }
            )
    
            return newGame;
                
        
    } catch (error) {
        console.log(error);
        throw new error("Failed to create game");
        
    }
}

export async function getUploadedFile(fileId) {
    try {
        const file =  storage.getFilePreview(appwriteConfig.storageId, fileId);
        return file;
    } catch (error) {
        console.log("Error getting file", error);
        throw new Error(error);
    }

}

  
export async function uploadFile(filename, mimeType, fileSize, uri) {

    try {
        const file = {
            name: filename,
            type: mimeType,
            size: fileSize,
            uri: uri,
        }

        const response = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);
        return response;

    } catch (error) {
        console.log("Error uploading file:", error);
        throw new Error(error);
    }
}


export async function getGames(page, limit=5) {

    try {

        const res = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.gameCollectionId, [
            Query.limit(limit),
            Query.offset(page * limit),
        ]);
        return res;
        
    } catch (error) {
        console.log("ErrorGetting games", error);
        throw new Error(error);
    }

}

export async function getGameDetails(gameId) {

    try {
        const res = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.gameCollectionId, gameID);
        return res;
        
    } catch (error) {
        console.log("ErrorGetting game details", error);
        throw new Error(error);
    }
}

export async function joinGame(gameId, userId) {

    try {

        const game = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.gameCollectionId, gameId);

        if (!game || !game.participants || !Array.isArray(game.participants)) {
            throw new Error('Invalid game or participants array');
        }

        if(game.participants.includes(userId)) {
            Alert.alert('Error', 'User already joined game');
            throw new Error('User already joined game');
        }
        
        const updatedParticipants = [...game.participants, userId];
        
        const res = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.gameCollectionId, gameId, {
            participants: updatedParticipants
        });
        
        return res;
        
    } catch (error) {
        console.log("Error joining game", error);
        throw new Error(error);
    }

} 

export async function userCreatedGames(userId) {
    
        try {
            const res = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.gameCollectionId, [
                Query.equal('userDetails', userId )
            ]);

            return res;
        } catch (error) {
            console.log("Error getting user created games", error);
            throw new Error(error);
        }
    
}

export async function userJoinedGames(userId) {
    
    try {
        const res = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.gameCollectionId, [
            Query.equal('participants', [userId])
        ]);
        return res;
    }
    catch (error) {
        console.log("Error getting user joined games", error);
        throw new Error(error);
    }
}


export async function deleteGame(gameId) {

    try {
        const res = await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.gameCollectionId, gameId);
        return res;
    } catch (error) {
        console.log("Error deleting game", error);
        throw new Error(error);
    }

}