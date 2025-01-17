import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'



const GenerateFormInput = () => {
  return (
    <div className='flex items-center gap-3 py-8'>
        <Input type='text' placeholder='Write a prompt to generate form...' />
        <Button>Generate Form</Button>
    </div>
  )
}

export default GenerateFormInput