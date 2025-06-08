import conf from '../conf/conf.js'
import { Client ,Account,ID } from 'appwrite'

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId)

export class AuthService {
  account;

  constructor(){
    this.account = new Account(client)
  }
  
  async createAccount({email,password,name}){
    try{
      const userAccount = await this.account.create(ID.unique(),email,password,name);
      if(userAccount){
        // call another method
        return this.login({email,password});
      }else{
        return userAccount;
      }
    }catch(error){
      throw error;
    }
  }

  async login({email,password}){
    try {
      return await this.account.createEmailPasswordSession(email,password);
    } catch (error) {
      throw error
    }
  }

  async getCurrentUser(){
    try {
      return await this.account.get();
    }catch (error) {
      if (error.code === 401) {
        return null; 
      }
      throw error;
    }
  }
  
  async logout(){
    try {
      await this.account.deleteSessions('current')
    } catch (error) {
      console.log("Appwrite service :: logout :: error",error)
    }
  }
}

const authService  = new AuthService()

export { client, authService }
