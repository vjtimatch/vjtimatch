"use client"

import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

export function LoginForm({ className, ...props }) {
  const router = useRouter()
  
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Sign in with your VJTI Google account
          </p>
        </div>
        
        <Field>
          <Button 
            variant="outline" 
            type="button" 
            className="w-full"
            onClick={() => router.push('/signup')}
          >
            
            I'm a new user
          </Button>
        </Field>

        <Field>
          <Button 
            variant="outline" 
            type="button" 
            className="w-full"
            onClick={() => router.push('/login')}
          >
            
            I already have an account
          </Button>
        </Field>

        <FieldDescription className="text-center text-xs">
          Only @vjti.ac.in email addresses are allowed
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
