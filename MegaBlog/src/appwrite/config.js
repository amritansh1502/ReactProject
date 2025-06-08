import conf from '../conf/conf.js';
import { ID, Databases, Storage, Query } from "appwrite";
import { client } from './auth.js';

export class Service{
    databases;
    bucket;
    
    constructor(){
        this.databases = new Databases(client);
        this.bucket = new Storage(client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            if(error.code === 401){
                // handle unauthorized error, e.g. logout or notify user
                console.log("Unauthorized: Please login again.");
            } else {
                console.log("Appwrite service :: createPost :: error", error);
            }
            throw error;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            if(error.code === 401){
                console.log("Unauthorized: Please login again.");
            } else {
                console.log("Appwrite service :: updatePost :: error", error);
            }
            throw error;
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            if(error.code === 401){
                console.log("Unauthorized: Please login again.");
            } else {
                console.log("Appwrite service :: deletePost :: error", error);
            }
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            if(error.code === 401){
                console.log("Unauthorized: Please login again.");
            } else {
                console.log("Appwrite service :: getPost :: error", error);
            }
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            if(error.code === 401){
                console.log("Unauthorized: Please login again.");
            } else {
                console.log("Appwrite service :: getPosts :: error", error);
            }
            return false
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            if(error.code === 401){
                console.log("Unauthorized: Please login again.");
            } else {
                console.log("Appwrite service :: uploadFile :: error", error);
            }
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            if(error.code === 401){
                console.log("Unauthorized: Please login again.");
            } else {
                console.log("Appwrite service :: deleteFile :: error", error);
            }
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}


const service = new Service()
export default service
