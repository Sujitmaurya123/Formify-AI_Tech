"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Import Cohere SDK
import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY || "",
});

export const generateForm = async (prevState: unknown, formData: FormData) => {
  try {
    // Check if the user is authenticated
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Check if the Cohere API key is available
    if (!process.env.COHERE_API_KEY) {
      return { success: false, message: "Cohere API key not found" };
    }

    // Define schema for validating the form data
    const schema = z.object({
      description: z.string().min(1, "Description is required"),
    });

    // Validate the input data
    const result = schema.safeParse({
      description: formData.get("description") as string,
    });

    if (!result.success) {
      return {
        success: false,
        message: "Invalid form data",
        error: result.error.errors,
      };
    }

    const description = result.data.description;

    // Prepare the prompt to generate a form using Cohere
    // const prompt =
    //   "create a JSON form with the following fields: title, fields (if any field includes options then keep it inside an array, not an object), button";

         const prompt = `Generate a JSON response for a form with the following structure. Ensure the keys and format remain constant in every response.
{
  "formTitle": "string", // The title of the form
  "formFields": [        // An array of fields in the form
    {
      "label": "string", // The label to display for the field
      "name": "string",  // The unique identifier for the field (used for form submissions)
      "placeholder": "string" // The placeholder text for the field
    }
  ]
}
Requirements:
- Use only the given keys: "formTitle", "formFields", "label", "name", "placeholder".
- Always include at least 3 fields in the "formFields" array.
- Keep the field names consistent across every generation for reliable rendering.
- Provide meaningful placeholder text for each field based on its label.
        `;

        // Request openai to genrate the form content


    // Use Cohere to generate the form
    const response = await cohere.chat({
      model: "command-r-plus", // Ensure the model name is correct
      messages: [
        {
          role: "user",
          content: `${description} ${prompt}`,
        },
      ],
    });

    // Log the response for debugging
    // console.log(response);

    // Check the structure of the response object
    const formContent = response?.message?.content?.[0]?.text || "";
    if (!formContent) {
      return { success: false, message: "Failed to generate form content" };
    }
    // Check if the form content is wrapped in a code block or not
    // Extract JSON-like content from text if present
    const jsonMatch = formContent.match(/{.*}/s); // Regex to match JSON structure
    if (!jsonMatch) {
      return { success: false, message: "Generated content is not in valid JSON format" };
    }

    const jsonString = jsonMatch[0]; // Extract the matched JSON string

    // Parse the JSON string

    // Parse the generated form content into JSON
    let formJsonData;
    try {
      formJsonData = JSON.parse(jsonString);
      // console.log(formJsonData)
    } catch (error) {
      console.log("Error parsing JSON", error);
      return { success: false, message: "Generated form content is not valid JSON" };
    }

    // Save the generated form to the database
    const form = await prisma.form.create({
      data: {
        ownerId: user.id,
        content: formJsonData || null,
      },
    });

    // Revalidate the forms dashboard page to reflect the changes
    revalidatePath("/dashboard/forms");

    return {
      success: true,
      message: "Form generated successfully.",
      data: form,
    };
  } catch (error) {
    // Log unexpected errors
    console.log("Unexpected error generating form", error);
    return {
      success: false,
      message: "An unexpected error occurred while generating the form",
    };
  }
};












// import {prisma} from "@/lib/prisma"
// import {currentUser} from "@clerk/nextjs/server"
// import {z} from "zod";
// import OpenAI from "openai"
// import { revalidatePath } from "next/cache";

// const openai= new OpenAI({apiKey:process.env.OPENAI_API_KEY!});



// export const generateForm = async(prevState:unknown, formData:FormData)=>{
//     try {
//         const user = await currentUser();
//         if(!user){
//             return {success:false,message:"User not found"}
//         }

//         // define the schema for validation

//         const schema = z.object({
//             description:z.string().min(1,"Description is required")
//         });
//         const result= schema.safeParse({
//             description:formData.get("description")as string
//         });
//         if(!result.success){
//             return {success:false, message:"Invalid form data", error:result.error.errors}
//         }

//         const description=result.data.description;

//         if(!process.env.OPENAI_API_KEY){
//             return {success:false, message:"OPENAI api key not found"}
//         }
//         const prompt= "create a json form with the following fields: title, fields (if any field include options then keep it inside array not object ), button"

//         // Request open ai to generate the form content

//         const completion = await openai.chat.completions.create({
//             messages:[{role:"user",content:`${description} ${prompt}`}],
//             model:"gpt-4" // Ensure model name is correct
//         });
//         console.log("Ai Generate Form",completion.choices[0]);

//         const formContent = completion.choices[0]?.message.content;
//         if(!formContent){
//             return {success:false, message:"Failed to generate form content"}
//         }
//         let formJsonData;
//         try {
//             formJsonData=JSON.parse(formContent);
//         } catch (error) {
//             console.log("Error parsing JSON",error);
//             return {success:false,message:"Generate form content is not vaild JSON"};
//         }
//         // save the generate form to the database
//         const form = await prisma.form.create({
//             data:{
//                 ownerId:user.id,
//                 content:formJsonData? formJsonData:null
//             }
//         });

//         revalidatePath("/dashboard/forms");// Optionally revalidate a path if necessary

//         return {
//          success:true,
//          message:"Form generate successfully.",
//          data:form
//         }


//     } catch (error) {
//         console.log("Error generate form",error);
//         return {
//             success:false,
//             message:"An error occurred while generate form"
//         }
//     }
// }