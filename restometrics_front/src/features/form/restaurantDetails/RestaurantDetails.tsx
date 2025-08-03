'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, User, Mail, Phone, Building2 } from 'lucide-react'

import { useFormStore } from '@/shared/model/formStore'
import { useRestaurantRegistration } from '@/shared/api/hooks/useRestaurantRegistration'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Loader } from '@/shared/ui/loader'
import { toast } from 'sonner'

const schema = z.object({
  ownerName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string()
    .min(1, 'Введите номер телефона')
    .refine(val => {
      if (!val) return false
      const numbers = val.replace(/\D/g, '')
      return numbers.length >= 1 && numbers.startsWith('7')
    }, 'Номер должен начинаться с 7'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  customRestaurantName: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export const RestaurantDetails = () => {
  const { data, updateData, nextStep, prevStep } = useFormStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const registerRestaurant = useRestaurantRegistration()


  const formatPhoneDisplay = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''

    let digits = numbers
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1)
    }
    if (!digits.startsWith('7') && digits.length > 0) {
      digits = '7' + digits
    }
    digits = digits.slice(0, 11)
    if (digits.length <= 1) return '+7'
    
    let formatted = '+7'
    const phoneDigits = digits.slice(1)
    
    if (phoneDigits.length > 0) {
      formatted += ' ('
      formatted += phoneDigits.slice(0, 3)
      if (phoneDigits.length >= 3 && phoneDigits.length > 3) {
        formatted += ') '
        formatted += phoneDigits.slice(3, 6)
        if (phoneDigits.length > 6) {
          formatted += '-'
          formatted += phoneDigits.slice(6, 8)
          if (phoneDigits.length > 8) {
            formatted += '-'
            formatted += phoneDigits.slice(8, 10)
          }
        }
      } else if (phoneDigits.length === 3) {
        formatted += ')'
      }
    }
    
    return formatted
  }

  const cleanPhoneForStore = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''

    let digits = numbers
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1)
    }
    if (!digits.startsWith('7') && digits.length > 0) {
      digits = '7' + digits
    }
    digits = digits.slice(0, 11)
    
    return digits.length >= 1 ? '+' + digits : ''
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ownerName: data.ownerName || '',
      phone: data.phone ? cleanPhoneForStore(data.phone) : '',
      email: data.email || '',
      customRestaurantName: data.customRestaurantName || '',
    }
  })

  const phoneValue = watch('phone')
  const onSubmit = async (formData: FormData) => {
    if (!data.selectedRestaurant) {
      toast.error('Сначала выберите ресторан')
      return
    }

    const phoneNumbers = formData.phone.replace(/\D/g, '')
    if (phoneNumbers.length !== 11) {
      toast.error('Введите полный номер телефона')
      return
    }

    setIsSubmitting(true)
    try {
      // Always store and send phone in +7XXXXXXXXXX format
      const phoneForStore = cleanPhoneForStore(formData.phone)
      const updatedFormData = { ...formData, phone: phoneForStore }
      updateData(updatedFormData)

      const registrationData = {
        selectedRestaurant: data.selectedRestaurant,
        ownerName: formData.ownerName,
        customRestaurantName: formData.customRestaurantName,
        phone: phoneForStore,
        email: formData.email,
      }

      await registerRestaurant.mutateAsync(registrationData)
      nextStep()
    } catch (error) {
      console.error('Ошибка отправки формы:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div 
      className="p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-foreground">
              <User className="w-6 h-6 text-primary" />
              Информация о владельце
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                Имя владельца *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register('ownerName')}
                  type="text"
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg 
                           focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200
                           text-foreground placeholder:text-muted-foreground"
                  placeholder="Введите ваше имя"
                />
              </div>
              {errors.ownerName && (
                <motion.p 
                  className="text-destructive text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.ownerName.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                Телефон *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="tel"
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg 
                           focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200
                           text-foreground placeholder:text-muted-foreground"
                  placeholder="+7 (999) 999-99-99"
                  value={formatPhoneDisplay(phoneValue || '')}
                  onChange={e => {
                    const inputValue = e.target.value
                    
                    if (!inputValue) {
                      setValue('phone', '', { shouldValidate: true })
                      return
                    }
                    
                    const numbers = inputValue.replace(/\D/g, '')
                    
                    if (!numbers) {
                      setValue('phone', '', { shouldValidate: true })
                      return
                    }
                    
                    const cleaned = cleanPhoneForStore(inputValue)
                    setValue('phone', cleaned, { shouldValidate: true })
                  }}
                  onKeyDown={e => {
                    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                      return
                    }
                    
                    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
                      return
                    }
                    
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  maxLength={18}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && (
                <motion.p 
                  className="text-destructive text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.phone.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                Email (необязательно)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg 
                           focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200
                           text-foreground placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <motion.p 
                  className="text-destructive text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {!data.selectedRestaurant && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  Название ресторана
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    {...register('customRestaurantName')}
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg 
                             focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200
                             text-foreground placeholder:text-muted-foreground"
                    placeholder="Введите название ресторана"
                  />
                </div>
              </motion.div>
            )}

            <motion.div 
              className="flex justify-between pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || registerRestaurant.isPending}
                className="flex items-center gap-2 min-w-[120px]"
              >
                {(isSubmitting || registerRestaurant.isPending) ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    Зарегистрировать
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  )
}
