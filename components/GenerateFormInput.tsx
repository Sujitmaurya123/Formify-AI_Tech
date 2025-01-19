"use client"
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {  useFormStatus } from 'react-dom'
import { Sparkles } from 'lucide-react'



const GenerateFormInput = () => {
  return (
    <div className='flex items-center gap-3 py-8'>
        <Input type='text' placeholder='Write a prompt to generate form...' />
       <SubmitButton/>
    </div>
  )
}

export default GenerateFormInput

const SubmitButton=()=>{
  const {pending}=useFormStatus();
  return (
    <Button className='h-12 bg-gradient-to-r from-blue-500 to bg-purple-600'>
      <Sparkles className='mr-2' />
       {
        pending ? (
          <span>
            Generating form...
          </span>
        ):(
          "Generate Form"
        )
       }
    </Button>
  )
}