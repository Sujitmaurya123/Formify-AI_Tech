"use server"

import prisma from "@/lib/prisma"
import {currentUser} from "@clerk/nextjs/server"
import {z} from "zod";
import OpenAI from "openai"
import { revalidatePath } from "next/cache";

const openai= new OpenAI({apiKey:process.env.OPENAI_API_KEY!});



export const generateForm = async(prevState:unknown, formData:FormData)=>{
    try {
        const user = await currentUser();
        if(!user){
            return {success:false,message:"User not found"}
        }

        // define the schema for validation

        const schema = z.object({
            description:z.string().min(1,"Description is required")
        });
        const result= schema.safeParse({
            description:formData.get("description")as string
        });
        if(!result.success){
            return {success:false, message:"Invalid form data", error:result.error.errors}
        }

        const description=result.data.description;

        if(!process.env.OPENAI_API_KEY){
            return {success:false, message:"OPENAI api key not found"}
        }
        const prompt= "create a json form with the following fields: title, fields (if any field include options then keep it inside array not object ), button"

        // Request open ai to generate the form content

        const completion = await openai.chat.completions.create({
            messages:[{role:"user",content:`${description} ${prompt}`}],
            model:"gpt-4" // Ensure model name is correct
        });
        console.log("Ai Generate Form",completion.choices[0]);

        const formContent = completion.choices[0]?.message.content;
        if(!formContent){
            return {success:false, message:"Failed to generate form content"}
        }
        let formJsonData;
        try {
            formJsonData=JSON.parse(formContent);
        } catch (error) {
            console.log("Error parsing JSON",error);
            return {success:false,message:"Generate form content is not vaild JSON"};
        }
        // save the generate form to the database
        const form = await prisma.form.create({
            data:{
                ownerId:user.id,
                content:formJsonData? formJsonData:null
            }
        });

        revalidatePath("/dashboard/forms");// Optionally revalidate a path if necessary

        return {
         success:true,
         message:"Form generate successfully.",
         data:form
        }


    } catch (error) {
        console.log("Error generate form",error);
        return {
            success:false,
            message:"An error occurred while generate form"
        }
    }
}