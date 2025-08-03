'use client'

import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui';
import Link from 'next/link';

export default function Home() {

  return (
    <div className="container mx-auto h-screen flex flex-col justify-center text-center space-y-6">
      {/* <Card className="flex flex-col items-center justify-center h-96 p-10 pb-20 shadow-xl rounded-3xl space-y-2"> */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Добро пожаловать!
        </h1>
        <p className="text-md md:text-xl text-center mb-6">
          Начните работу с нашей платформой для управления рестораном.
        </p>
        </div>
        <Link href="/dashboard" passHref>
          <Button className="w-64 h-16 text-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200">
        Начать работу
          </Button>
        </Link>
      {/* </Card> */}
    </div>
  );
}
