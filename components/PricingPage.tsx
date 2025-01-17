import React from 'react'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { PricingPlan, pricingPlan } from '@/lib/pricingplan'
import { Badge } from './ui/badge'


const PricingPage = () => {

  return (
    <div>
        <div className='text-center mb-16'>
              <h1 className='font-extrabold text-4xl'>Plan Pricing and</h1>
              <p className='text-gray-500'>Receive unlimited credits when you pay earl, and save your plan.</p>
        </div>
    <div className='grid grid-cols-3 gap-10'>
        {
            pricingPlan.map((plan:PricingPlan,index:number)=>(
                <Card key={index} className={`${plan.level === "Enterprise" && "bg-[#1c1c1c] text-white"
                    } w-[350px] flex flex-col justify-between`}>
                    <CardHeader className='flex items-center flex-cols-3 gap-6'>
                        <CardTitle>{plan.level}</CardTitle>
                       {
                            plan.level === "Pro" && <Badge className='rounded-full bg-orange-600 hover:bg-null'>🔥Popular</Badge>
                       }
                    </CardHeader>
                    <CardContent className='flex-1'>
                        <p className='text-2xl font-bold'>{plan.price}</p>
                        <ul className='mt-4 space-y-2'>
                            {
                                plan.services.map((item:string,index:number)=>(
                                   <li className='flex items-center' key={index}>
                                        <span className="text-green-500 mr-2">✓</span>

                                    {item}</li> 
                                ))
                            }
                        </ul>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            variant={`${plan.level === "Enterprise" ? "default" : "outline"
                                }`}
                            className={`${plan.level === "Enterprise" &&
                                "text-black bg-white hover:bg-null"
                                } w-full`}
                            
                        >
                            Get started with {plan.level}
                        </Button>
                    </CardFooter>
                </Card>
            ))
        }
    </div>
    </div>
  )
}

export default PricingPage